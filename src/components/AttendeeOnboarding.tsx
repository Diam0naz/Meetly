/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  User,
  Briefcase,
  Layers,
  Search,
  Compass,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { PRESET_TAGS } from '../mockData';
import { Attendee, VibePreference } from '../types';

interface AttendeeOnboardingProps {
  onComplete: (attendee: Attendee) => void;
  onCancel?: () => void;
  existingCount: number;
}

export const AttendeeOnboarding: React.FC<AttendeeOnboardingProps> = ({
  onComplete,
  onCancel,
  existingCount,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [canHelpWith, setCanHelpWith] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [vibe, setVibe] = useState<VibePreference>('deep');

  // Random fun avatars for new user
  const randomAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&auto=format&fit=crop&q=80',
  ];

  const toggleHelpTag = (tag: string) => {
    if (canHelpWith.includes(tag)) {
      setCanHelpWith(canHelpWith.filter((t) => t !== tag));
    } else {
      if (canHelpWith.length < 2) {
        setCanHelpWith([...canHelpWith, tag]);
      }
    }
  };

  const toggleLookingTag = (tag: string) => {
    if (lookingFor.includes(tag)) {
      setLookingFor(lookingFor.filter((t) => t !== tag));
    } else {
      if (lookingFor.length < 2) {
        setLookingFor([...lookingFor, tag]);
      }
    }
  };

  const isStep1Valid = name.trim().length >= 2 && title.trim().length >= 3;
  const isStep2Valid = canHelpWith.length === 2 && lookingFor.length === 2;

  const handleFinish = () => {
    const newAttendee: Attendee = {
      id: `att-custom-${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      company: company.trim() || undefined,
      avatar: randomAvatars[existingCount % randomAvatars.length],
      canHelpWith: canHelpWith as [string, string],
      lookingFor: lookingFor as [string, string],
      vibe: vibe,
      checkedIn: true,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      zone: 'Networking Corner',
      contact: {
        handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        telegram: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        twitter: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@meetly.io`,
      },
      funFact: `Excited about ${canHelpWith.join(' & ')} collaboration!`,
      bingoTraits: [1, 2, 5, 12, 17],
      pastMatches: [],
    };

    onComplete(newAttendee);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-xs">
      <div>
        {/* Header & Speed Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-xs font-display">
              M
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 tracking-tight font-display">
                60-Second Onboarding
              </h2>
              <p className="text-[11px] text-stone-500">Step {step} of 3</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-amber-900 text-xs font-semibold font-display">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Fast Matching</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden my-5">
          <div
            className="bg-amber-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">Who are you?</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Keep it concise so attendees immediately grasp your superpower.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-display">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-display">
                  One-line "What I do" *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Building zero-knowledge rollups & rust dApps"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Appears directly on your match card and event badge.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-display">
                  Project or Studio (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Independent / Venture Lab"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Pick 2 Help & 2 Looking For */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">Complementary Tags</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Our match engine pairs your give with someone else’s take.
              </p>
            </div>

            {/* Help Tags: pick 2 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 font-display">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  <span>I can help with (Pick 2)</span>
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                    canHelpWith.length === 2
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {canHelpWith.length} / 2
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = canHelpWith.includes(tag);
                  const isMax = canHelpWith.length >= 2 && !isSelected;
                  return (
                    <button
                      key={`help-${tag}`}
                      type="button"
                      disabled={isMax}
                      onClick={() => toggleHelpTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 font-display ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isMax
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Looking For Tags: pick 2 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 font-display">
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>I am looking for (Pick 2)</span>
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                    lookingFor.length === 2
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {lookingFor.length} / 2
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = lookingFor.includes(tag);
                  const isMax = lookingFor.length >= 2 && !isSelected;
                  return (
                    <button
                      key={`look-${tag}`}
                      type="button"
                      disabled={isMax}
                      onClick={() => toggleLookingTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 font-display ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : isMax
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Vibe Question */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">Your Networking Vibe</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                How would you prefer your event interactions structured?
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: Find one good conversation (Deep) */}
              <div
                onClick={() => setVibe('deep')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  vibe === 'deep'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      vibe === 'deep'
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-stone-900">
                        Find one good conversation
                      </h4>
                      {vibe === 'deep' && (
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-display">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      Deep dive with your #1 algorithmic match. We spotlight the strongest complementary counterpart for focused discussion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Meet many new people (Broad) */}
              <div
                onClick={() => setVibe('broad')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  vibe === 'broad'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      vibe === 'broad'
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-stone-900">
                        Meet many new people
                      </h4>
                      {vibe === 'broad' && (
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-display">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      Broad exploration and fast rotations. Equally balanced 3 matches plus fast bingo game connections across the room.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              <div className="font-semibold text-stone-800 font-display">Your Profile Summary:</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="text-stone-500">Helping:</span>{' '}
                <strong className="text-emerald-700">{canHelpWith.join(', ')}</strong>
                <span className="text-stone-300 mx-1">|</span>
                <span className="text-stone-500">Seeking:</span>{' '}
                <strong className="text-amber-800">{lookingFor.join(', ')}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="pt-6 pb-2 space-y-2">
        {step < 3 ? (
          <button
            type="button"
            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
            onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 py-3 text-sm font-bold text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition font-display"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 py-3 text-sm font-bold text-white shadow-xs active:scale-[0.99] transition font-display"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Generate My 3 Matches</span>
          </button>
        )}

        <div className="flex items-center justify-between px-1">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 py-1"
            >
              Back
            </button>
          ) : onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 py-1"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          <span className="text-[11px] text-stone-400">
            {step === 1 ? 'Takes 20s' : step === 2 ? 'Takes 30s' : 'Ready to match'}
          </span>
        </div>
      </div>
    </div>
  );
};
