/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Meetly Match Engine
 * Pure functional matching algorithm without ML dependencies.
 */

import { Attendee, MatchResult } from './types';

/**
 * Calculates match score between a source attendee and a candidate attendee.
 * 
 * SCORING LOGIC:
 * - Mutual Complementarity (Weight: +3 per link):
 *   Scores both directions:
 *   1) My "help" tags that candidate is "looking for"
 *   2) Candidate's "help" tags that I am "looking for"
 * - Shared Interests (Weight: +1 per overlapping tag):
 *   Checks overlap across all registered tags (help + looking) between both attendees.
 * - Past Match Penalty (Weight: -2):
 *   Deducts 2 points if candidates have already been matched at previous meetups,
 *   encouraging discovery of fresh conversations.
 */
export function calculateMatchScore(
  source: Attendee,
  candidate: Attendee
): {
  totalScore: number;
  breakdown: {
    mutualComplementarity: number;
    sharedInterests: number;
    pastMatchPenalty: number;
  };
  details: {
    sourceHelpsCandidate: string[];
    candidateHelpsSource: string[];
    sharedTags: string[];
    wasPastMatch: boolean;
  };
} {
  // 1. Mutual Complementarity calculation
  const sourceHelpsCandidate = source.canHelpWith.filter((skill) =>
    candidate.lookingFor.includes(skill)
  );
  const candidateHelpsSource = candidate.canHelpWith.filter((skill) =>
    source.lookingFor.includes(skill)
  );
  const totalComplementaryLinks =
    sourceHelpsCandidate.length + candidateHelpsSource.length;
  const complementarityScore = 3 * totalComplementaryLinks;

  // 2. Shared Interests calculation (skills or needs in common)
  const sourceAllTags = new Set([...source.canHelpWith, ...source.lookingFor]);
  const candidateAllTags = new Set([
    ...candidate.canHelpWith,
    ...candidate.lookingFor,
  ]);
  const sharedTags: string[] = [];
  sourceAllTags.forEach((tag) => {
    if (candidateAllTags.has(tag)) {
      sharedTags.push(tag);
    }
  });
  const sharedInterestsScore = 1 * sharedTags.length;

  // 3. Past Match Penalty (-2 points if previously matched)
  const wasPastMatch =
    (source.pastMatches && source.pastMatches.includes(candidate.id)) ||
    (candidate.pastMatches && candidate.pastMatches.includes(source.id));
  const pastMatchPenalty = wasPastMatch ? -2 : 0;

  const totalScore = complementarityScore + sharedInterestsScore + pastMatchPenalty;

  return {
    totalScore,
    breakdown: {
      mutualComplementarity: complementarityScore,
      sharedInterests: sharedInterestsScore,
      pastMatchPenalty,
    },
    details: {
      sourceHelpsCandidate,
      candidateHelpsSource,
      sharedTags,
      wasPastMatch,
    },
  };
}

/**
 * Builds a natural, conversational reason template for why these two people are matched.
 */
export function generateMatchReason(
  source: Attendee,
  candidate: Attendee,
  details: {
    sourceHelpsCandidate: string[];
    candidateHelpsSource: string[];
    sharedTags: string[];
    wasPastMatch: boolean;
  }
): string {
  const { sourceHelpsCandidate, candidateHelpsSource, sharedTags } = details;

  // Scenario 1: Mutual two-way exchange
  if (sourceHelpsCandidate.length > 0 && candidateHelpsSource.length > 0) {
    return `You can help each other: ${candidate.name.split(' ')[0]} is looking for ${sourceHelpsCandidate[0]}, and you need help with ${candidateHelpsSource[0]}.`;
  }

  // Scenario 2: Candidate needs source's expertise
  if (sourceHelpsCandidate.length > 0) {
    return `${candidate.name.split(' ')[0]} is looking for ${sourceHelpsCandidate.join(' & ')}, which you specialize in.`;
  }

  // Scenario 3: Source needs candidate's expertise
  if (candidateHelpsSource.length > 0) {
    return `${candidate.name.split(' ')[0]} has high expertise in ${candidateHelpsSource.join(' & ')}, matching your current search.`;
  }

  // Scenario 4: Common shared domain/passion
  if (sharedTags.length > 0) {
    return `Shared focus: You both share an active focus in ${sharedTags.join(' & ')}.`;
  }

  // Fallback reason
  return `Cross-disciplinary match: Great conversation exchange between ${source.canHelpWith[0] || 'tech'} and ${candidate.canHelpWith[0] || 'strategy'}.`;
}

/**
 * Main engine entry point:
 * Returns exactly 3 matches for the specified attendee.
 * If attendee chose "one good conversation" vibe, the #1 top match is flagged for special spotlighting.
 */
export function getMatchesForAttendee(
  sourceAttendee: Attendee,
  allAttendees: Attendee[],
  previouslyFoundIds: string[] = []
): MatchResult[] {
  // Candidate pool excluding the attendee themselves
  const candidatePool = allAttendees.filter((a) => a.id !== sourceAttendee.id);

  const scoredCandidates = candidatePool.map((candidate) => {
    const { totalScore, breakdown, details } = calculateMatchScore(
      sourceAttendee,
      candidate
    );
    const reason = generateMatchReason(sourceAttendee, candidate, details);

    return {
      matchedAttendee: candidate,
      score: totalScore,
      reason,
      found: previouslyFoundIds.includes(candidate.id),
      foundAt: previouslyFoundIds.includes(candidate.id) ? 'Earlier' : undefined,
      isTopMatchHighlight: false,
      scoreBreakdown: breakdown,
    };
  });

  // Sort candidates by total score descending, breaking ties by mutual complementarity and then candidate name
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (
      b.scoreBreakdown.mutualComplementarity !==
      a.scoreBreakdown.mutualComplementarity
    ) {
      return (
        b.scoreBreakdown.mutualComplementarity -
        a.scoreBreakdown.mutualComplementarity
      );
    }
    return a.matchedAttendee.name.localeCompare(b.matchedAttendee.name);
  });

  // Take exactly 3 matches
  const topThree = scoredCandidates.slice(0, 3);

  // Respect the vibe answer: "one good conversation" users see the top match highlighted
  if (sourceAttendee.vibe === 'deep' && topThree.length > 0) {
    topThree[0].isTopMatchHighlight = true;
  }

  return topThree;
}
