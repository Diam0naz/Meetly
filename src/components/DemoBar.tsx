/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  CloudRain,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Shield,
  User,
  X,
} from 'lucide-react';
import { Attendee } from '../types';

interface DemoBarProps {
  isOrganizerView: boolean;
  onToggleView: (isOrganizer: boolean) => void;
  currentMinute: number;
  onSetMinute: (minute: number) => void;
  attendees: Attendee[];
  currentAttendeeId: string;
  onSelectAttendee: (id: string) => void;
  forceHighRainSim: boolean;
  onToggleRainSim: () => void;
  onResetDemo: () => void;
  onOpenOnboarding: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({
  isOrganizerView,
  onToggleView,
  currentMinute,
  onSetMinute,
  attendees,
  currentAttendeeId,
  onSelectAttendee,
  forceHighRainSim,
  onToggleRainSim,
  onResetDemo,
  onOpenOnboarding,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default to declutter

  const quickMinutes = [0, 20, 40, 60, 80];

  return (
    <aside aria-label="Demo simulation controls" className="fixed top-3 right-3 sm:right-6 z-50 transition-all font-sans">
      {/* Floating Pill Toggle */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-full bg-stone-900/90 text-stone-100 hover:bg-stone-900 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md border border-stone-700/60 transition active:scale-95"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-display font-bold tracking-tight text-amber-300">Demo</span>
          <span className="text-stone-400 font-mono text-[11px]">T+{currentMinute}m</span>
          <span className="bg-stone-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-amber-400">
            {isOrganizerView ? 'Org' : 'Att'}
          </span>
          <Sliders className="w-3.5 h-3.5 text-stone-400" />
        </button>
      ) : (
        /* Expanded Floating Card */
        <div className="w-[340px] max-w-[92vw] rounded-2xl bg-stone-900/95 backdrop-blur-xl text-stone-100 border border-stone-700/80 shadow-2xl p-3.5 text-xs animate-in zoom-in-95 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-display font-bold text-sm tracking-tight text-white">
                Event Simulation Hub
              </span>
              <span className="font-mono text-[11px] text-amber-400 font-semibold">
                T+{currentMinute}m
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Perspective Switcher */}
          <div>
            <div className="text-[11px] font-semibold text-stone-400 mb-1.5">View Perspective:</div>
            <div className="grid grid-cols-2 gap-1.5 bg-stone-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleView(false)}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  !isOrganizerView
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Attendee</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleView(true)}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isOrganizerView
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Organizer</span>
              </button>
            </div>
          </div>

          {/* Clock Fast Forward */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
              <span className="flex items-center gap-1 font-semibold text-stone-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Event Timeline:</span>
              </span>
              <span className="font-bold text-amber-300">
                {currentMinute === 0
                  ? 'Min 0: Arrivals'
                  : currentMinute === 20
                  ? 'Min 20: Match #1'
                  : currentMinute === 40
                  ? 'Min 40: Match #2'
                  : currentMinute === 60
                  ? 'Min 60: Bingo & #3'
                  : 'Min 80: Wrap Up'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 font-mono">
              {quickMinutes.map((m) => (
                <button
                  key={m}
                  onClick={() => onSetMinute(m)}
                  className={`py-1 rounded-lg text-[11px] font-bold transition ${
                    currentMinute === m
                      ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          {/* Attendee Selector (when viewing as attendee) */}
          {!isOrganizerView && (
            <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Current Attendee:</span>
                <button
                  onClick={onOpenOnboarding}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Onboard New</span>
                </button>
              </div>
              <select
                value={currentAttendeeId}
                onChange={(e) => onSelectAttendee(e.target.value)}
                className="w-full bg-stone-800 text-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {attendees.map((att) => (
                  <option key={att.id} value={att.id}>
                    {att.name} ({att.title.slice(0, 24)}...)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
            <button
              onClick={onToggleRainSim}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                forceHighRainSim
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Simulate Rain &gt;60%</span>
            </button>

            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 text-stone-400 hover:text-white px-2 py-1 rounded-lg hover:bg-stone-800 transition"
              title="Reset state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
