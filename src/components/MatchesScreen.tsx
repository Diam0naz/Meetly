/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle,
  Circle,
  MapPin,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
  MessageSquareQuote,
  Shuffle,
  Copy,
  Check,
  Loader2,
  Wand2,
  Sun,
  Snowflake,
} from 'lucide-react';
import { Attendee, MatchResult } from '../types';
import { RotationNudgeBanner } from './RotationNudgeBanner';
import {
  IcebreakerQuestion,
  generateTailoredIcebreakers,
  generateAIIcebreaker,
} from '../icebreakerEngine';

interface MatchesScreenProps {
  currentAttendee: Attendee;
  matches: MatchResult[];
  onToggleFound: (matchedAttendeeId: string) => void;
  onNavigateToMapWithAttendee?: (attendeeId: string) => void;
  onNavigateToConnect?: (attendeeId: string) => void;
  currentMinute: number;
  onGoToMap: () => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  currentAttendee,
  matches,
  onToggleFound,
  onNavigateToMapWithAttendee,
  onNavigateToConnect,
  currentMinute,
  onGoToMap,
}) => {
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  // Icebreakers state per matched attendee ID
  const [icebreakers, setIcebreakers] = useState<Record<string, IcebreakerQuestion>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize tailored icebreakers when matches change
  useEffect(() => {
    setIcebreakers((prev) => {
      const next = { ...prev };
      matches.forEach((match) => {
        const pId = match.matchedAttendee.id;
        if (!next[pId]) {
          const pool = generateTailoredIcebreakers(currentAttendee, match.matchedAttendee, match.reason);
          next[pId] = pool[Math.floor(Math.random() * pool.length)];
        }
      });
      return next;
    });
  }, [matches, currentAttendee]);

  const handleShuffleIcebreaker = (matchedAttendee: Attendee, reason: string) => {
    const pool = generateTailoredIcebreakers(currentAttendee, matchedAttendee, reason);
    const current = icebreakers[matchedAttendee.id];
    const available = pool.filter((q) => q.question !== current?.question);
    const candidateList = available.length > 0 ? available : pool;
    const randomChoice = candidateList[Math.floor(Math.random() * candidateList.length)];
    setIcebreakers((prev) => ({
      ...prev,
      [matchedAttendee.id]: randomChoice,
    }));
  };

  const handleGenerateAIIcebreaker = async (matchedAttendee: Attendee, reason: string) => {
    setAiLoading((prev) => ({ ...prev, [matchedAttendee.id]: true }));
    try {
      const aiResult = await generateAIIcebreaker(currentAttendee, matchedAttendee, reason);
      if (aiResult) {
        setIcebreakers((prev) => ({
          ...prev,
          [matchedAttendee.id]: aiResult,
        }));
      } else {
        handleShuffleIcebreaker(matchedAttendee, reason);
      }
    } catch {
      handleShuffleIcebreaker(matchedAttendee, reason);
    } finally {
      setAiLoading((prev) => ({ ...prev, [matchedAttendee.id]: false }));
    }
  };

  const handleCopyQuestion = (questionText: string, attendeeId: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(questionText).catch(() => {});
    }
    setCopiedId(attendeeId);
    setTimeout(() => {
      setCopiedId((curr) => (curr === attendeeId ? null : curr));
    }, 2000);
  };

  const foundCount = matches.filter((m) => m.found).length;

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Event Rotation Nudge Banner */}
      <RotationNudgeBanner
        currentMinute={currentMinute}
        matches={matches}
        onGoToMatches={() => {}}
        onGoToMap={onGoToMap}
      />

      {/* Screen Title & Found Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800 px-3 py-1 rounded-full font-display">
            Curated Network
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1.5">
            Your 3 Algorithmic Matches
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">
            Paired using two-way complementarity, shared goals, and zone proximity
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-2xl bg-stone-900 dark:bg-stone-800 text-stone-100 px-4 py-2 text-sm font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <span>
            {foundCount} of {matches.length} Met
          </span>
        </div>
      </div>

      {/* Deep vibe spotlight notice */}
      {currentAttendee.vibe === 'deep' && (
        <div className="rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-900 dark:text-amber-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="text-sm text-stone-800 dark:text-stone-200">
            <strong className="font-display font-bold text-amber-950 dark:text-amber-200">
              Deep Conversation Preference:
            </strong>{' '}
            Match #1 holds your highest mutual complementarity score. Prioritize finding them first for a meaningful exchange.
          </div>
        </div>
      )}

      {/* 3 Matches in Responsive Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match, index) => {
          const person = match.matchedAttendee;
          const isHighlighted = match.isTopMatchHighlight;
          const isScoreExpanded = expandedScoreId === person.id;
          const currentIcebreaker = icebreakers[person.id];
          const isAiLoading = aiLoading[person.id] || false;
          const isCopied = copiedId === person.id;

          return (
            <div
              key={person.id}
              className={`rounded-3xl border transition-all flex flex-col justify-between ${
                isHighlighted
                  ? 'border-2 border-amber-500/90 dark:border-amber-500 bg-white dark:bg-stone-900 shadow-md shadow-amber-900/5 ring-4 ring-amber-500/10'
                  : 'border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs hover:border-amber-400/50'
              } p-5 sm:p-6 relative overflow-hidden`}
            >
              {/* Highlight badge for top match */}
              {isHighlighted && (
                <div className="absolute top-0 right-0 bg-amber-600 text-stone-950 text-xs font-black uppercase px-3.5 py-1.5 rounded-bl-2xl tracking-wider flex items-center gap-1.5 font-display">
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>Primary Match</span>
                </div>
              )}

              <div>
                {/* Person Header */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-stone-900 dark:bg-stone-800 text-stone-100 text-xs font-bold flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-xs font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate">
                      {person.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-snug line-clamp-2 mt-0.5">
                      {person.title}
                    </p>

                    {person.company && (
                      <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5">
                        {person.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Algorithmic Reason Box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-stone-850 border border-amber-100/80 dark:border-stone-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Why you matched</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                    "{match.reason}"
                  </p>
                </div>

                {/* Skill Overlap Breakdown */}
                <div className="mt-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">
                      Can Help:
                    </span>
                    {person.canHelpWith.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 tracking-wider">
                      Seeking:
                    </span>
                    {person.lookingFor.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tailored Icebreaker & Discussion Starter Box */}
                <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-stone-850 dark:to-stone-850 border border-amber-200/80 dark:border-stone-800 p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MessageSquareQuote className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display truncate">
                        Discussion Starter
                      </span>
                      {currentIcebreaker && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${currentIcebreaker.categoryColor}`}
                        >
                          {currentIcebreaker.categoryLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleShuffleIcebreaker(person, match.reason)}
                        className="px-2.5 py-1 rounded-xl text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 transition text-xs font-semibold flex items-center gap-1 shadow-2xs active:scale-95"
                        title="Shuffle another tailored question"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span className="hidden sm:inline">Roll</span>
                      </button>

                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleGenerateAIIcebreaker(person, match.reason)}
                        className="px-2.5 py-1 rounded-xl text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 border border-amber-300/80 dark:border-amber-800 transition text-xs font-semibold flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                        title="Generate tailored starter with AI"
                      >
                        {isAiLoading ? (
                          <Loader2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-spin" />
                        ) : (
                          <Wand2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        )}
                        <span>AI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyQuestion(
                            currentIcebreaker?.question || '',
                            person.id
                          )
                        }
                        className="p-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 transition text-xs font-semibold flex items-center gap-1 shadow-2xs active:scale-95"
                        title="Copy question"
                      >
                        {isCopied ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold px-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/95 dark:bg-stone-800 p-3 border border-amber-100 dark:border-stone-700/80 shadow-2xs">
                    <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed font-sans italic">
                      "{currentIcebreaker?.question ||
                        `I saw you're deep into ${person.canHelpWith[0]}. What is the #1 mistake you see teams make with it?`}"
                    </p>
                    {currentIcebreaker?.contextHint && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">Why tailored: {currentIcebreaker.contextHint}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Location */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => onNavigateToMapWithAttendee?.(person.id)}
                    className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 font-semibold transition"
                  >
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>In <strong className="text-stone-900 dark:text-stone-100">{person.zone}</strong></span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedScoreId(isScoreExpanded ? null : person.id)
                    }
                    className="flex items-center gap-1 text-xs font-bold text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                  >
                    <span>Score: {match.score} pts</span>
                    {isScoreExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded Score Details */}
                {isScoreExpanded && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5 animate-in fade-in">
                    <div className="font-bold text-stone-700 dark:text-stone-300 font-display">Score Components:</div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Complementary Skills:</span>
                      <strong className="text-amber-700 dark:text-amber-400">+{match.breakdown.skillComplementScore} pts</strong>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Shared Craft Overlap:</span>
                      <strong className="text-amber-700 dark:text-amber-400">+{match.breakdown.craftOverlapScore} pts</strong>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Vibe Alignment:</span>
                      <strong className="text-amber-700 dark:text-amber-400">+{match.breakdown.vibeScore} pts</strong>
                    </div>
                  </div>
                )}

                {/* Primary Action Button: Mark as Met / Found */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleFound(person.id)}
                    className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.98] font-display ${
                      match.found
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    }`}
                  >
                    {match.found ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Connected & Met</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark as Found</span>
                      </>
                    )}
                  </button>

                  {match.found && onNavigateToConnect && (
                    <button
                      type="button"
                      onClick={() => onNavigateToConnect(person.id)}
                      className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition"
                      title="Send post-event follow-up note"
                    >
                      <Send className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
