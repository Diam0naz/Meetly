/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Tailored Icebreaker & Discussion Starter Engine
 * Generates contextual conversation starters tailored to the match's mutual skills,
 * backgrounds, fun facts, zones, and communication vibes.
 */

import { GoogleGenAI } from '@google/genai';
import { Attendee } from './types';

export type IcebreakerCategory =
  | 'skill_exchange'
  | 'fun_fact'
  | 'contrarian'
  | 'future_vision'
  | 'casual'
  | 'ai_generated';

export interface IcebreakerQuestion {
  id: string;
  category: IcebreakerCategory;
  categoryLabel: string;
  categoryColor: string; // Tailwind class
  question: string;
  contextHint: string;
  source: 'dictionary' | 'ai';
}

/**
 * Procedural tailored question generator from internal dictionary
 */
export function generateTailoredIcebreakers(
  source: Attendee,
  target: Attendee,
  matchReason?: string
): IcebreakerQuestion[] {
  const starters: IcebreakerQuestion[] = [];

  // Identify complementary overlap
  const targetHelpsSource = target.canHelpWith.filter((skill) =>
    source.lookingFor.includes(skill)
  );
  const sourceHelpsTarget = source.canHelpWith.filter((skill) =>
    target.lookingFor.includes(skill)
  );
  const sharedSkills = target.canHelpWith.filter((skill) =>
    source.canHelpWith.includes(skill)
  );

  // 1. Complementary Skill Starters (Target can help source)
  if (targetHelpsSource.length > 0) {
    const skill = targetHelpsSource[0];
    starters.push({
      id: `skill-help-1-${target.id}`,
      category: 'skill_exchange',
      categoryLabel: 'Skill Exchange',
      categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      question: `I saw you're deep into ${skill}. As someone looking to build more in that space, what's the #1 mistake you see teams make with it?`,
      contextHint: `You are looking for ${skill} and ${target.name.split(' ')[0]} specializes in it`,
      source: 'dictionary',
    });

    starters.push({
      id: `skill-help-2-${target.id}`,
      category: 'skill_exchange',
      categoryLabel: 'Pro Advice',
      categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      question: `If you were advising someone starting on a zero-to-one ${skill} project today, what framework or tooling would you reach for first?`,
      contextHint: `Leverages ${target.name.split(' ')[0]}'s background in ${skill}`,
      source: 'dictionary',
    });
  }

  // 2. Complementary Skill Starters (Source can help target)
  if (sourceHelpsTarget.length > 0) {
    const skill = sourceHelpsTarget[0];
    starters.push({
      id: `skill-seek-1-${target.id}`,
      category: 'skill_exchange',
      categoryLabel: 'Collaboration',
      categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
      question: `I noticed you're looking for help with ${skill}. What specific hurdle or milestone is your team tackling around that right now?`,
      contextHint: `You have expertise in ${skill} that ${target.name.split(' ')[0]} is actively seeking`,
      source: 'dictionary',
    });
  }

  // 3. Shared Skill Starter
  if (sharedSkills.length > 0) {
    const skill = sharedSkills[0];
    starters.push({
      id: `shared-1-${target.id}`,
      category: 'skill_exchange',
      categoryLabel: 'Shared Craft',
      categoryColor: 'bg-stone-100 text-stone-800 border-stone-200',
      question: `We both focus on ${skill}! What's the biggest shift you've observed in ${skill} over the past year that isn't getting enough attention?`,
      contextHint: `You both share core experience in ${skill}`,
      source: 'dictionary',
    });
  }

  // 4. Fun Fact tailored spark
  if (target.funFact && target.funFact.trim().length > 0) {
    const cleanedFact = target.funFact.replace(/\.$/, '');
    starters.push({
      id: `fact-1-${target.id}`,
      category: 'fun_fact',
      categoryLabel: 'Fun Fact Spark',
      categoryColor: 'bg-orange-50 text-orange-800 border-orange-200',
      question: `Your fun fact says you ${cleanedFact.toLowerCase().startsWith('has ') ? cleanedFact.substring(4) : cleanedFact} — I have to know, what is the story behind that?`,
      contextHint: `Based on ${target.name.split(' ')[0]}'s profile fun fact`,
      source: 'dictionary',
    });
  }

  // 5. Role & Company contextual question
  if (target.company) {
    starters.push({
      id: `role-1-${target.id}`,
      category: 'casual',
      categoryLabel: 'Company & Mission',
      categoryColor: 'bg-stone-50 text-stone-700 border-stone-200',
      question: `What is the most exciting or high-stakes challenge your team at ${target.company} is working on this quarter?`,
      contextHint: `Tailored to their role as ${target.title} at ${target.company}`,
      source: 'dictionary',
    });
  } else {
    starters.push({
      id: `role-alt-1-${target.id}`,
      category: 'casual',
      categoryLabel: 'Day-to-day',
      categoryColor: 'bg-stone-50 text-stone-700 border-stone-200',
      question: `As a ${target.title}, what part of your work gives you the most energy right now?`,
      contextHint: `Tailored to their role: ${target.title}`,
      source: 'dictionary',
    });
  }

  // 6. Deep Dive / Contrarian Question (especially impactful for 'deep' vibe)
  starters.push({
    id: `deep-1-${target.id}`,
    category: 'contrarian',
    categoryLabel: 'Thought Provoker',
    categoryColor: 'bg-amber-100/70 text-amber-900 border-amber-300',
    question: `What is one contrarian opinion you have about tech, startups, or product building that most people in this room would argue with?`,
    contextHint: `Designed for memorable, high-substance conversation`,
    source: 'dictionary',
  });

  // 7. Future Vision Question
  starters.push({
    id: `future-1-${target.id}`,
    category: 'future_vision',
    categoryLabel: 'Future Vision',
    categoryColor: 'bg-stone-100 text-stone-800 border-stone-200',
    question: `If you had unlimited resources and 6 months to solve any single problem in your field, what would you build?`,
    contextHint: `Uncovers big ambitions and creative thinking`,
    source: 'dictionary',
  });

  // 8. Venue / Zone contextual warm-up
  starters.push({
    id: `casual-zone-${target.id}`,
    category: 'casual',
    categoryLabel: 'Meetup Warm-up',
    categoryColor: 'bg-stone-50 text-stone-700 border-stone-200',
    question: `Hey ${target.name.split(' ')[0]}! Caught you over by ${target.zone}. How has the mixer been treating you tonight? What's your goal before you leave?`,
    contextHint: `Current location in ${target.zone}`,
    source: 'dictionary',
  });

  return starters;
}

/**
 * Optional AI generation call using @google/genai SDK
 * Falls back to tailored dictionary if API key is absent or request fails.
 */
export async function generateAIIcebreaker(
  source: Attendee,
  target: Attendee,
  matchReason?: string
): Promise<IcebreakerQuestion | null> {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' &&
      (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY) ||
    '';

  if (!apiKey) {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert networking wingman for a high-density founder and builder meetup.
Generate ONE engaging, punchy, and natural icebreaker question or discussion starter tailored between these two attendees:

Person 1 (User asking):
- Name: ${source.name}
- Title: ${source.title}
- Can Help With: ${source.canHelpWith.join(', ')}
- Looking For: ${source.lookingFor.join(', ')}
- Conversation style: ${source.vibe}

Person 2 (Match being approached):
- Name: ${target.name}
- Title: ${target.title}
- Company: ${target.company || 'Independent'}
- Can Help With: ${target.canHelpWith.join(', ')}
- Looking For: ${target.lookingFor.join(', ')}
- Fun Fact: ${target.funFact}
- Venue Zone: ${target.zone}
- Why they matched: ${matchReason || 'High skill complementarity'}

Rules:
1. Return ONLY the question/starter in plain text.
2. Max 25-35 words.
3. Natural, friendly, and non-generic. Reference their specific skill overlap, company, or fun fact.
4. Do NOT include quotes, bullets, markdown, or greetings like "Hi". Just the discussion starter.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim().replace(/^["']|["']$/g, '');
    if (!text) return null;

    return {
      id: `ai-gen-${Date.now()}`,
      category: 'ai_generated',
      categoryLabel: '✨ AI Tailored',
      categoryColor: 'bg-amber-500/15 text-amber-950 border-amber-300',
      question: text,
      contextHint: `Synthesized via Gemini based on mutual complementarity and background`,
      source: 'ai',
    };
  } catch (err) {
    console.warn('Gemini icebreaker generation skipped, using internal engine:', err);
    return null;
  }
}
