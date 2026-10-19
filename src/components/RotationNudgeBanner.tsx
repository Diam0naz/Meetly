/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { MatchResult } from '../types';

interface RotationNudgeBannerProps {
  currentMinute: number;
  matches: MatchResult[];
  onGoToMatches: () => void;
  onGoToMap: () => void;
}

export const RotationNudgeBanner: React.FC<RotationNudgeBannerProps> = ({
  currentMinute,
  matches,
  onGoToMatches,
  onGoToMap,
}) => {
  const match1 = matches[0]?.matchedAttendee;
  const match2 = matches[1]?.matchedAttendee;
  const match3 = matches[2]?.matchedAttendee;

  let bannerConfig = {
    title: 'Event Kickoff & Arrivals',
    subtitle: 'Check in, grab refreshments, and review your 3 curated matches.',
    actionLabel: 'View Matches',
    action: onGoToMatches,
    badge: 'Min 0 - 19',
    accentBadge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    showMapTarget: false,
  };

  if (currentMinute >= 20 && currentMinute < 40) {
    bannerConfig = {
      title: `Rotation #1: Meet ${match1 ? match1.name.split(' ')[0] : 'Match #1'}`,
      subtitle: match1
        ? `Connect with ${match1.name} in ${match1.zone} (${match1.title})`
        : 'Connect with your primary match now.',
      actionLabel: 'Locate on Map',
      action: onGoToMap,
      badge: 'Minute 20 Nudge',
      accentBadge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
      showMapTarget: true,
    };
  } else if (currentMinute >= 40 && currentMinute < 60) {
    bannerConfig = {
      title: `Rotation #2: Meet ${match2 ? match2.name.split(' ')[0] : 'Match #2'}`,
      subtitle: match2
        ? `Rotate now: Seek out ${match2.name} in ${match2.zone}`
        : 'Rotate to your second match.',
      actionLabel: 'Locate on Map',
      action: onGoToMap,
      badge: 'Minute 40 Nudge',
      accentBadge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      showMapTarget: true,
    };
  } else if (currentMinute >= 60 && currentMinute < 80) {
    bannerConfig = {
      title: `Rotation #3: Meet ${match3 ? match3.name.split(' ')[0] : 'Match #3'} & Bingo`,
      subtitle: match3
        ? `Find ${match3.name} in ${match3.zone} and stamp your Bingo grid.`
        : 'Final rotation & speed networking.',
      actionLabel: 'View Matches & Game',
      action: onGoToMatches,
      badge: 'Minute 60 Nudge',
      accentBadge: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
      showMapTarget: true,
    };
  } else if (currentMinute >= 80) {
    bannerConfig = {
      title: 'Wrap-Up & Exchange Contacts',
      subtitle: 'Great connections made! Exchange 1-tap contact cards before departing.',
      actionLabel: 'People You Met',
      action: onGoToMatches,
      badge: 'Minute 80+ Wrap',
      accentBadge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      showMapTarget: false,
    };
  }

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-4 sm:p-5 shadow-sm border border-stone-800 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${bannerConfig.accentBadge}`}>
              <Clock className="w-3 h-3" />
              <span>{bannerConfig.badge}</span>
            </span>
            <span className="text-xs font-mono text-stone-400">
              T+{currentMinute}m
            </span>
          </div>

          <h4 className="font-display text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{bannerConfig.title}</span>
          </h4>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            {bannerConfig.subtitle}
          </p>
        </div>

        <div className="shrink-0 pt-1 sm:pt-0">
          <button
            onClick={bannerConfig.action}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 shadow-sm active:scale-95 transition"
          >
            {bannerConfig.showMapTarget && <MapPin className="w-3.5 h-3.5 text-stone-950" />}
            <span>{bannerConfig.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
