/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Sparkles,
  Map,
  Trophy,
  CloudSun,
  Users,
} from 'lucide-react';

export type AttendeeTab = 'event' | 'matches' | 'map' | 'game' | 'weather' | 'connect';

interface NavigationProps {
  activeTab: AttendeeTab;
  onTabChange: (tab: AttendeeTab) => void;
  matchesCount: number;
  foundCount: number;
  hasWeatherAlert: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  matchesCount,
  foundCount,
  hasWeatherAlert,
}) => {
  const tabs = [
    {
      id: 'event' as AttendeeTab,
      label: 'Event',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'matches' as AttendeeTab,
      label: 'Matches',
      icon: Sparkles,
      badge: `${foundCount}/${matchesCount}`,
    },
    {
      id: 'map' as AttendeeTab,
      label: 'Map',
      icon: Map,
      badge: null,
    },
    {
      id: 'game' as AttendeeTab,
      label: 'Bingo',
      icon: Trophy,
      badge: null,
    },
    {
      id: 'weather' as AttendeeTab,
      label: 'Weather',
      icon: CloudSun,
      badge: hasWeatherAlert ? '!' : null,
      alert: hasWeatherAlert,
    },
    {
      id: 'connect' as AttendeeTab,
      label: 'Connect',
      icon: Users,
      badge: foundCount > 0 ? `${foundCount}` : null,
    },
  ];

  return (
    <nav
      aria-label="Mobile attendee navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-stone-800 shadow-xl safe-bottom transition-colors duration-200"
    >
      <div className="w-full max-w-lg mx-auto grid grid-cols-6 h-18 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 transition-all select-none relative ${
                isActive
                  ? 'text-amber-800 dark:text-amber-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <span className="absolute top-0 w-9 h-1 bg-amber-600 dark:bg-amber-500 rounded-b-full" />
              )}

              <div className="relative mt-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'scale-110 stroke-[2.4] text-amber-600 dark:text-amber-400'
                      : 'text-stone-500 dark:text-stone-400'
                  }`}
                />

                {/* Badge or Alert Dot */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-none ${
                      tab.alert
                        ? 'bg-amber-600 text-white animate-pulse'
                        : isActive
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 font-display tracking-tight leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
