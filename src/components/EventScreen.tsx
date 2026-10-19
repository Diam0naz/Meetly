/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  CheckCircle2,
  Compass,
  ArrowRight,
  Flame,
  Search,
  Shirt,
  X,
  Droplets,
  Wind,
} from 'lucide-react';
import { Attendee, MatchResult, MeetupEvent, WeatherData } from '../types';
import { WeatherWidget } from './WeatherWidget';
import { RotationNudgeBanner } from './RotationNudgeBanner';
import { generateClothingRecommendations } from '../clothingAdvisor';

interface EventScreenProps {
  event: MeetupEvent;
  currentAttendee: Attendee;
  matches: MatchResult[];
  weather: WeatherData;
  isLoadingWeather: boolean;
  onRefreshWeather: () => void;
  onNavigateToMatches: () => void;
  onNavigateToMap: () => void;
  onNavigateToGame: () => void;
  onNavigateToWeather?: () => void;
  currentMinute: number;
}

export const EventScreen: React.FC<EventScreenProps> = ({
  event,
  currentAttendee,
  matches,
  weather,
  isLoadingWeather,
  onRefreshWeather,
  onNavigateToMatches,
  onNavigateToMap,
  onNavigateToGame,
  onNavigateToWeather,
  currentMinute,
}) => {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isCopiedAddress, setIsCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText?.(event.address);
    setIsCopiedAddress(true);
    setTimeout(() => setIsCopiedAddress(false), 2000);
  };

  const foundCount = matches.filter((m) => m.found).length;

  const clothingAdvice = generateClothingRecommendations(
    weather,
    event.currentIndoorPlanActive,
    'balanced'
  );

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Event Rotation Nudge Banner */}
      <RotationNudgeBanner
        currentMinute={currentMinute}
        matches={matches}
        onGoToMatches={onNavigateToMatches}
        onGoToMap={onNavigateToMap}
      />

      {/* Responsive Dashboard Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Info & Badge) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Hero Event Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-[#271e16] dark:from-stone-950 dark:via-stone-900 dark:to-[#1c140d] text-stone-100 p-6 sm:p-8 shadow-sm relative overflow-hidden border border-stone-800 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-xs font-semibold text-amber-300 font-display">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Meetly Curated Meetup</span>
              </span>

              <span className="text-xs font-bold font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1 rounded-full">
                {event.isFree ? 'Free RSVP' : `$${event.ticketPrice}`}
              </span>
            </div>

            <h1 className="font-display mt-5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {event.title}
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-sans">
              {event.tagline}
            </p>

            {/* Event Details Meta */}
            <div className="mt-6 space-y-3 text-sm border-t border-stone-800 pt-5">
              <div className="flex items-center gap-3 text-stone-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">{event.dateTime}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">{event.venueName}</span>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="text-xs text-amber-300 hover:text-white font-medium bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition"
                >
                  {isCopiedAddress ? 'Address Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>

            {/* Venue Tag */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs sm:text-sm text-stone-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>
                {event.currentIndoorPlanActive
                  ? 'Indoor Plan Active (Level 2 Covered Atrium)'
                  : event.isOutdoor
                  ? 'Outdoor Rooftop Terrace & Garden'
                  : 'Indoor Venue'}
              </span>
            </div>
          </div>

          {/* Attendee's Digital Badge Card */}
          <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Your Attendee Pass
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 px-3 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Checked In</span>
                </span>
              </div>

              <button
                onClick={() => setIsBadgeModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-display"
              >
                <QrCode className="w-4 h-4" />
                <span>Enlarge QR</span>
              </button>
            </div>

            <div className="flex items-start gap-4 sm:gap-5">
              <img
                src={currentAttendee.avatar}
                alt={currentAttendee.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 truncate">
                  {currentAttendee.name}
                </h3>

                <p className="text-sm text-stone-600 dark:text-stone-400 font-medium leading-snug line-clamp-1 mt-0.5">
                  {currentAttendee.title} • {currentAttendee.company}
                </p>

                <div className="mt-2 flex items-center gap-2.5 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {currentAttendee.contact.handle}
                  </span>
                  <span>•</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold font-display">
                    {currentAttendee.vibe === 'deep' ? '🎯 Deep Focus' : '⚡ Broad Explorer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60">
                <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1 font-display">
                  <Flame className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Can Help With:</span>
                </span>
                <div className="font-semibold text-emerald-950 dark:text-emerald-200">
                  {currentAttendee.canHelpWith.join(' • ')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/60">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1 font-display">
                  <Search className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Looking For:</span>
                </span>
                <div className="font-semibold text-amber-950 dark:text-amber-200">
                  {currentAttendee.lookingFor.join(' • ')}
                </div>
              </div>
            </div>

            {/* Quick Match Action */}
            <button
              onClick={onNavigateToMatches}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 py-3.5 text-sm font-bold text-white shadow-xs active:scale-[0.99] transition font-display"
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-white" />
              <span>View Your 3 Matches ({foundCount}/3 Met)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (Weather, Attire Advisory & Quick Nav) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Open-Meteo Weather Section */}
          <WeatherWidget
            weather={weather}
            event={event}
            isLoading={isLoadingWeather}
            onRefresh={onRefreshWeather}
            onViewClothingAdvice={onNavigateToWeather}
            isOrganizer={false}
          />

          {/* Dedicated Attire & Comfort Snapshot Card */}
          <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                    What to Wear Tonight
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    Personal Comfort Advisory
                  </span>
                </div>
              </div>

              {onNavigateToWeather && (
                <button
                  onClick={onNavigateToWeather}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline font-display"
                >
                  Full Guide &rarr;
                </button>
              )}
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {clothingAdvice.overallSummary}
            </p>

            <div className="space-y-2 pt-1 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                <span className="text-amber-700 dark:text-amber-400 font-bold font-display shrink-0">• Tops:</span>
                <span>{clothingAdvice.keyCategories.topAndLayers.advice}</span>
              </div>
              <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-display shrink-0">• Footwear:</span>
                <span>{clothingAdvice.keyCategories.footwear.advice}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1.5">
              {clothingAdvice.quickPicks.map((pick, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-lg"
                >
                  {pick}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Dashboard Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={onNavigateToMap}
              className="p-5 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400/50 cursor-pointer transition shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition border border-amber-100 dark:border-amber-800/60">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-display text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                Interactive Map
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Locate your matches and check area microclimates
              </p>
            </div>

            <div
              onClick={onNavigateToGame}
              className="p-5 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400/50 cursor-pointer transition shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition border border-amber-100 dark:border-amber-800/60">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-display text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                5×5 QR Bingo
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Gamified networking with live leaderboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Badge Modal */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-7 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Meetly NFC / QR Pass
              </span>
              <button
                onClick={() => setIsBadgeModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#fbf9f5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 inline-block">
              {/* Simulated QR Pattern */}
              <div className="w-48 h-48 mx-auto bg-stone-900 dark:bg-stone-100 p-3 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-white dark:bg-stone-900 rounded-sm p-1.5 flex items-center justify-center">
                    <div className="w-full h-full bg-stone-900 dark:bg-stone-100 rounded-xs" />
                  </div>
                  <div className="w-12 h-12 bg-white dark:bg-stone-900 rounded-sm p-1.5 flex items-center justify-center">
                    <div className="w-full h-full bg-stone-900 dark:bg-stone-100 rounded-xs" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-display font-extrabold text-sm text-white dark:text-stone-900 tracking-wider">
                    MEETLY
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-white dark:bg-stone-900 rounded-sm p-1.5 flex items-center justify-center">
                    <div className="w-full h-full bg-stone-900 dark:bg-stone-100 rounded-xs" />
                  </div>
                  <div className="w-10 h-10 border-2 border-dashed border-white/60 dark:border-stone-800 rounded-sm" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                {currentAttendee.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Scan for instant 1-on-1 connect & Bingo verification
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
