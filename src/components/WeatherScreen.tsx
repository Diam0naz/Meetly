/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldAlert,
  Home,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { MeetupEvent, WeatherData } from '../types';
import { WeatherWidget } from './WeatherWidget';
import { ClothingAdvisorCard } from './ClothingAdvisorCard';

interface WeatherScreenProps {
  weather: WeatherData;
  event: MeetupEvent;
  isLoading: boolean;
  onRefresh: () => void;
  onSwitchToIndoorPlan?: () => void;
  isOrganizer?: boolean;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  weather,
  event,
  isLoading,
  onRefresh,
  onSwitchToIndoorPlan,
  isOrganizer = false,
}) => {
  const clothingSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToClothing = () => {
    clothingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800 px-3 py-1 rounded-full font-display">
            Live Meteorology & Comfort
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-2">
            Venue Microclimate & Attire Guide
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">
            Real-time conditions via Open-Meteo for {event.venueName} & smart area clothing advisory
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 rounded-2xl bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 px-4 py-2.5 text-sm font-bold text-stone-800 dark:text-stone-200 shadow-xs active:scale-95 transition disabled:opacity-50 font-display"
        >
          <RefreshCw className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Forecast</span>
        </button>
      </div>

      {/* Main Weather Widget */}
      <WeatherWidget
        weather={weather}
        event={event}
        isLoading={isLoading}
        onRefresh={onRefresh}
        onSwitchToIndoorPlan={onSwitchToIndoorPlan}
        onViewClothingAdvice={handleScrollToClothing}
        isOrganizer={isOrganizer}
      />

      {/* CLOTHING & PERSONAL COMFORT ADVISOR (User Request: "use the weather readings and suggestions from the areas to recommend clothing choices for maximum pesonal comfort") */}
      <div ref={clothingSectionRef} className="scroll-mt-20">
        <ClothingAdvisorCard
          weather={weather}
          isIndoorPlanActive={event.currentIndoorPlanActive}
        />
      </div>

      {/* Desktop 2-Column Grid: Hourly on Left (7 cols), Contingency Protocols on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Hourly Forecast */}
        <div className="lg:col-span-7 w-full rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">
                Hourly Trajectory During Meetup
              </span>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display mt-0.5">
                Temperature & Rain Window
              </h4>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Event Timeline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { time: '18:00', temp: weather.temperature, rain: Math.max(weather.rainProbability - 5, 5), note: 'Arrival & Welcome' },
              { time: '19:00', temp: weather.temperature, rain: weather.rainProbability, note: 'Match Rotations' },
              { time: '20:00', temp: Math.round(weather.temperature - 1), rain: Math.min(weather.rainProbability + 4, 100), note: 'Twilight Chill' },
              { time: '21:00', temp: Math.round(weather.temperature - 2), rain: weather.rainProbability, note: 'After-Hours' },
            ].map((hour, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800 text-center hover:border-amber-400/40 transition"
              >
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 font-display">{hour.time}</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-500 mb-1">{hour.note}</span>
                <div className="my-2 p-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <CloudSun className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                  {hour.temp}°C
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-md mt-1.5 font-mono">
                  <Droplets className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                  <span>{hour.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contingency Protocol Explanation Card */}
        <div className="lg:col-span-5 w-full rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">
              Contingency & Venue Safeguards
            </span>
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display pb-3 border-b border-stone-100 dark:border-stone-800 mt-0.5">
              Event Comfort Protocols
            </h4>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-1 shrink-0" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block font-display">
                  30-Minute Polling Loop:
                </strong>
                Open-Meteo checks temperature and precipitation probability every 30 minutes within 24h of the event.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1 shrink-0" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block font-display">
                  &gt; 60% Rain Threshold:
                </strong>
                If precipitation probability reaches 60% or higher for outdoor terrace venues, warning alerts are broadcast to attendees and an instant one-click switch to the covered indoor atrium is unlocked.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 flex items-start gap-3">
              <Home className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-1 shrink-0" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block font-display">
                  Indoor Fallback Location:
                </strong>
                {event.indoorVenueNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
