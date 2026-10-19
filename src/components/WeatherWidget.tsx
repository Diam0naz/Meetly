/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Home,
  CheckCircle2,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { WeatherData, MeetupEvent } from '../types';
import { generateClothingRecommendations } from '../clothingAdvisor';

interface WeatherWidgetProps {
  weather: WeatherData;
  event: MeetupEvent;
  isLoading: boolean;
  onRefresh: () => void;
  onSwitchToIndoorPlan?: () => void;
  onViewClothingAdvice?: () => void;
  isOrganizer?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  event,
  isLoading,
  onRefresh,
  onSwitchToIndoorPlan,
  onViewClothingAdvice,
  isOrganizer = false,
}) => {
  const renderWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    if (code <= 2) return <CloudSun className="w-8 h-8 text-amber-500" />;
    if (code <= 48) return <Cloud className="w-8 h-8 text-stone-400" />;
    if (code <= 82) return <CloudRain className="w-8 h-8 text-amber-700 dark:text-amber-400" />;
    return <CloudLightning className="w-8 h-8 text-orange-600 dark:text-orange-400" />;
  };

  const isRainRisk = weather.rainProbability > 60;
  const isOutdoor = event.isOutdoor && !event.currentIndoorPlanActive;

  // Derive comfort & clothing preview from weather
  const clothingAdvice = generateClothingRecommendations(
    weather,
    event.currentIndoorPlanActive,
    'balanced'
  );

  return (
    <div className="w-full space-y-4">
      {/* High rain risk alert banner if outdoor & rain > 60% */}
      {isRainRisk && isOutdoor && (
        <div className="w-full rounded-3xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/95 dark:bg-amber-950/30 p-5 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 shrink-0 mt-0.5 font-bold shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-base font-bold text-amber-950 dark:text-amber-200">
                  Precipitation Risk: {weather.rainProbability}% Probability
                </h4>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/50 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                  Outdoor Setting
                </span>
              </div>
              <p className="mt-1.5 text-sm text-amber-900 dark:text-amber-300/90 leading-relaxed">
                Open-Meteo microclimate indicates high precipitation likelihood for the rooftop garden during event hours. Bring a water-resistant layer or compact umbrella.
              </p>

              {isOrganizer && onSwitchToIndoorPlan && (
                <div className="mt-3.5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onSwitchToIndoorPlan}
                    className="flex items-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-xs active:scale-95 transition font-display"
                  >
                    <Home className="w-4 h-4" />
                    <span>Switch to Indoor Plan</span>
                  </button>
                  <span className="text-xs text-amber-800 dark:text-amber-400">
                    Broadcasts instant notification & switches venue notes
                  </span>
                </div>
              )}

              {!isOrganizer && (
                <div className="mt-3 text-xs sm:text-sm text-amber-950 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-800">
                  Organizer has been alerted. Indoor contingency plan is ready if rain begins.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indoor plan activated notice */}
      {event.currentIndoorPlanActive && (
        <div className="w-full rounded-3xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/30 p-5 text-emerald-950 dark:text-emerald-100 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 text-base font-bold font-display">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>Indoor Plan Activated</span>
          </div>
          <p className="mt-1.5 text-sm text-emerald-800 dark:text-emerald-300">
            {event.indoorVenueNote}
          </p>
        </div>
      )}

      {/* Main Weather Card: Takes Full Width */}
      <div className="w-full rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">
                Venue Microclimate
              </span>
              <span className="inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
                Open-Meteo Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Lat {event.coordinates.lat.toFixed(4)}, Lon {event.coordinates.lon.toFixed(4)} • {event.venueName}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 active:rotate-180 transition disabled:opacity-50"
            title="Refresh forecast"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20">
              {renderWeatherIcon(weather.weatherCode)}
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                {weather.temperature}°C
                <span className="text-sm sm:text-base font-normal text-stone-500 dark:text-stone-400 ml-2 font-sans">
                  ({Math.round((weather.temperature * 9) / 5 + 32)}°F)
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-stone-700 dark:text-stone-300 mt-1">
                {weather.weatherDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 font-mono">
              <Droplets className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{weather.rainProbability}% rain chance</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                <Wind className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                <span>{weather.windSpeed} km/h wind</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clothing Comfort Recommendation Snapshot Banner */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-display">
                  Recommended Attire:
                </span>
                <span className="text-xs text-amber-900 dark:text-amber-300 font-semibold bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  {clothingAdvice.comfortIndex}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                {clothingAdvice.overallSummary}
              </p>
            </div>
          </div>

          {onViewClothingAdvice && (
            <button
              onClick={onViewClothingAdvice}
              className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-white dark:bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs hover:shadow-xs transition font-display"
            >
              <span>View Area Breakdown</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Checked: {weather.lastUpdated}</span>
          <span className="text-amber-700 dark:text-amber-400 font-medium font-display">
            30m Auto-Monitor
          </span>
        </div>
      </div>
    </div>
  );
};
