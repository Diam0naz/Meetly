/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Shirt,
  Sparkles,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Snowflake,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Compass,
  Footprints,
  Umbrella,
  Glasses,
  Briefcase,
} from 'lucide-react';
import { WeatherData } from '../types';
import {
  generateClothingRecommendations,
  ComfortProfile,
  AreaClothingAdvice,
} from '../clothingAdvisor';

interface ClothingAdvisorCardProps {
  weather: WeatherData;
  isIndoorPlanActive?: boolean;
  initialProfile?: ComfortProfile;
  compact?: boolean;
  selectedAreaId?: string;
  onSelectArea?: (areaId: string) => void;
}

export const ClothingAdvisorCard: React.FC<ClothingAdvisorCardProps> = ({
  weather,
  isIndoorPlanActive = false,
  initialProfile = 'balanced',
  compact = false,
  selectedAreaId,
  onSelectArea,
}) => {
  const [profile, setProfile] = useState<ComfortProfile>(initialProfile);
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [activeAreaTab, setActiveAreaTab] = useState<string>('all');

  const recommendations = useMemo(() => {
    return generateClothingRecommendations(weather, isIndoorPlanActive, profile);
  }, [weather, isIndoorPlanActive, profile]);

  const renderAreaIcon = (iconName: AreaClothingAdvice['iconName']) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-sky-500" />;
      case 'cloud-rain':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-indigo-400" />;
      case 'shirt':
        return <Shirt className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Thermometer className="w-5 h-5 text-orange-500" />;
    }
  };

  const filteredAreaTips = useMemo(() => {
    if (activeAreaTab === 'all') return recommendations.areaTips;
    return recommendations.areaTips.filter((tip) => tip.areaId === activeAreaTab);
  }, [recommendations.areaTips, activeAreaTab]);

  return (
    <div className="w-full rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-all duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 border-b border-stone-100 dark:border-stone-800/80 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/20 dark:via-orange-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-900 dark:text-amber-300 font-display">
                <Shirt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>What to Wear • Personal Comfort Advisor</span>
              </span>

              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200/80 dark:border-stone-700">
                {recommendations.comfortIndex}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Microclimate-Tailored Clothing Recommendations
            </h3>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
              {recommendations.overallSummary}
            </p>
          </div>

          {/* Personal Comfort Sensitivity Switch */}
          <div className="shrink-0 bg-stone-100 dark:bg-stone-800/90 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 pt-0.5 text-center font-display">
              Comfort Profile
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setProfile('runs_cold')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  profile === 'runs_cold'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-display'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Tends to feel chilly faster; suggests warmer layers"
              >
                <Snowflake className="w-3.5 h-3.5 text-indigo-500" />
                <span>Runs Cold</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile('runs_warm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  profile === 'runs_warm'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-display'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Tends to warm up easily; emphasizes breathable fabrics"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Runs Warm</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile('balanced')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  profile === 'balanced'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-display'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Standard balanced temperature perception"
              >
                <span>Balanced</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Picks Pills */}
        <div className="mt-4 pt-3.5 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-display">
            Quick Checklist:
          </span>
          {recommendations.quickPicks.map((pick, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{pick}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-7 space-y-6">
        {/* 4 Key Categories Grid: Decluttered & Roomy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Top & Core Layers */}
          <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 p-5 space-y-3 hover:border-amber-400/50 transition">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  {recommendations.keyCategories.topAndLayers.title}
                </h4>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Modular Layers
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {recommendations.keyCategories.topAndLayers.advice}
            </p>

            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap gap-1.5">
              {recommendations.keyCategories.topAndLayers.examples.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200/80 dark:border-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Bottoms & Trousers */}
          <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 p-5 space-y-3 hover:border-amber-400/50 transition">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  {recommendations.keyCategories.bottoms.title}
                </h4>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Clean Silhouette
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {recommendations.keyCategories.bottoms.advice}
            </p>

            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap gap-1.5">
              {recommendations.keyCategories.bottoms.examples.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200/80 dark:border-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Footwear & Movement */}
          <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 p-5 space-y-3 hover:border-amber-400/50 transition">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  {recommendations.keyCategories.footwear.title}
                </h4>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Walking Comfort
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {recommendations.keyCategories.footwear.advice}
            </p>

            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap gap-1.5">
              {recommendations.keyCategories.footwear.examples.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200/80 dark:border-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Weather & Venue Accessories */}
          <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 p-5 space-y-3 hover:border-amber-400/50 transition">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-400">
                <Umbrella className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                  {recommendations.keyCategories.weatherAccessories.title}
                </h4>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Preparedness
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {recommendations.keyCategories.weatherAccessories.advice}
            </p>

            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap gap-1.5">
              {recommendations.keyCategories.weatherAccessories.examples.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200/80 dark:border-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Venue Area Microclimate Clothing Guide */}
        <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/60 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-stone-800">
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Venue Area Microclimate & Comfort Breakdown
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Temperature fluctuates up to 4°C between outdoor garden terrace and air-conditioned stages.
              </p>
            </div>

            {/* Area Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveAreaTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition font-display ${
                  activeAreaTab === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                All Areas
              </button>
              {recommendations.areaTips.map((tip) => (
                <button
                  key={tip.areaId}
                  type="button"
                  onClick={() => setActiveAreaTab(tip.areaId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition font-display ${
                    activeAreaTab === tip.areaId
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {tip.areaId}
                </button>
              ))}
            </div>
          </div>

          {/* Area Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAreaTips.map((areaTip) => (
              <div
                key={areaTip.areaId}
                className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-850 p-4 sm:p-5 space-y-3 shadow-xs hover:border-amber-400/40 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20">
                      {renderAreaIcon(areaTip.iconName)}
                    </div>
                    <div>
                      <h5 className="font-display text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                        {areaTip.areaName}
                      </h5>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Effective microclimate: ~{areaTip.feltTemperature}°C
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                      areaTip.environment === 'outdoor'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : areaTip.environment === 'indoor_ac'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {areaTip.environment.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <strong className="text-stone-800 dark:text-stone-200 block font-display mb-0.5">
                    Microclimate Reading:
                  </strong>
                  {areaTip.climateNote}
                </div>

                <div className="text-sm text-stone-800 dark:text-stone-200 font-medium">
                  <span className="text-amber-800 dark:text-amber-400 font-bold font-display mr-1">
                    What to wear:
                  </span>
                  {areaTip.clothingTip}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {areaTip.recommendedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
