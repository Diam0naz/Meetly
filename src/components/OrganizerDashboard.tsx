/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  QrCode,
  Calendar,
  MapPin,
  CheckCircle2,
  Share2,
  Check,
  Home,
  Sparkles,
  Ticket,
  Clock,
  Activity,
  UserCheck,
  Trophy,
  CloudSun,
  Search,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Attendee, MeetupEvent, WeatherData, ActivityItem, ActivityType } from '../types';
import { WeatherWidget } from './WeatherWidget';

interface OrganizerDashboardProps {
  event: MeetupEvent;
  onUpdateEvent: (updated: Partial<MeetupEvent>) => void;
  attendees: Attendee[];
  onToggleCheckIn: (attendeeId: string) => void;
  weather: WeatherData;
  isLoadingWeather: boolean;
  onRefreshWeather: () => void;
  onSwitchToIndoorPlan: () => void;
  totalBingoSquaresCompleted: number;
  activities: ActivityItem[];
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  event,
  onUpdateEvent,
  attendees,
  onToggleCheckIn,
  weather,
  isLoadingWeather,
  onRefreshWeather,
  onSwitchToIndoorPlan,
  totalBingoSquaresCompleted,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity' | 'checkin' | 'edit'>('dashboard');
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [editFormData, setEditFormData] = useState(event);

  // Activity feed filtering state
  const [activityFilter, setActivityFilter] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const totalRSVPs = attendees.length;
  const matchesComputedCount = totalRSVPs * 3;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#meetup=${event.id}`;
    navigator.clipboard?.writeText?.(link);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2500);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEvent(editFormData);
    setActiveTab('dashboard');
  };

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const typeMatches =
        activityFilter === 'all'
          ? true
          : activityFilter === 'weather'
          ? act.type === 'weather' || act.type === 'plan'
          : act.type === activityFilter;

      const query = searchQuery.trim().toLowerCase();
      const textMatches =
        !query ||
        act.title.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query) ||
        (act.attendeeName && act.attendeeName.toLowerCase().includes(query)) ||
        (act.badge && act.badge.toLowerCase().includes(query));

      return typeMatches && textMatches;
    });
  }, [activities, activityFilter, searchQuery]);

  // Helper for styling activity icons and badges with warm amber/stone palette
  const getActivityStyling = (type: ActivityType) => {
    switch (type) {
      case 'checkin':
        return {
          icon: UserCheck,
          iconBg: 'bg-emerald-600 text-white',
          badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
          dotBg: 'bg-emerald-600',
        };
      case 'bingo':
        return {
          icon: Trophy,
          iconBg: 'bg-amber-600 text-white',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
          dotBg: 'bg-amber-600',
        };
      case 'weather':
        return {
          icon: CloudSun,
          iconBg: 'bg-orange-600 text-white',
          badgeBg: 'bg-orange-50 text-orange-900 border-orange-200/80',
          dotBg: 'bg-orange-600',
        };
      case 'plan':
        return {
          icon: Home,
          iconBg: 'bg-stone-800 text-white',
          badgeBg: 'bg-stone-100 text-stone-900 border-stone-200',
          dotBg: 'bg-stone-800',
        };
      case 'match':
        return {
          icon: Sparkles,
          iconBg: 'bg-amber-500 text-stone-950 font-bold',
          badgeBg: 'bg-amber-50 text-amber-950 border-amber-200',
          dotBg: 'bg-amber-500',
        };
      default:
        return {
          icon: Bell,
          iconBg: 'bg-stone-700 text-white',
          badgeBg: 'bg-stone-50 text-stone-700 border-stone-200',
          dotBg: 'bg-stone-500',
        };
    }
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full font-display">
            Organizer Command Center
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1.5">
            {event.title}
          </h2>
        </div>

        <button
          onClick={handleCopyLink}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-800 shadow-xs active:scale-95 transition"
        >
          {isCopiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Share Event Link</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap rounded-xl bg-stone-200/70 p-1 text-xs font-bold gap-1 font-display">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg transition ${
            activeTab === 'dashboard'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Live Stats
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <span>Activity Feed</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-200">
            {activities.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg transition ${
            activeTab === 'checkin'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          QR Check-Ins ({checkedInCount}/{totalRSVPs})
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg transition ${
            activeTab === 'edit'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Edit Meetup
        </button>
      </div>

      {/* TAB 1: LIVE STATS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid: 4 columns on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-ins */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Check-Ins
                </span>
                <Users className="w-4 h-4 text-amber-700" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-black text-stone-900">
                  {checkedInCount}
                </span>
                <span className="text-xs text-stone-500 font-medium font-sans">
                  / {event.capacity} cap
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${(checkedInCount / event.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Matches Generated */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Active Matches
                </span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-black text-stone-900">
                  {matchesComputedCount}
                </span>
                <span className="text-xs text-stone-500 font-medium font-sans">
                  pairs
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 font-sans">
                3 curated per attendee
              </p>
            </div>

            {/* RSVPs & Revenue */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-[11px] font-bold uppercase tracking-wider font-display">
                  RSVP Type
                </span>
                <Ticket className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="mt-2.5">
                <span className="font-display text-3xl font-black text-stone-900">
                  {event.isFree ? 'Free' : `$${event.ticketPrice}`}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 font-sans">
                {totalRSVPs} confirmed builders
              </p>
            </div>

            {/* Bingo Stamps */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Bingo Activity
                </span>
                <QrCode className="w-4 h-4 text-amber-700" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-black text-stone-900">
                  {totalBingoSquaresCompleted}
                </span>
                <span className="text-xs text-stone-500 font-medium font-sans">
                  stamps
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 font-sans">
                High room engagement
              </p>
            </div>
          </div>

          {/* Desktop 2-column layout: Left (Weather & Logistics) vs Right (Live Activity Stream) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Weather Card with Organizer Indoor Plan switch */}
              <WeatherWidget
                weather={weather}
                event={event}
                isLoading={isLoadingWeather}
                onRefresh={onRefreshWeather}
                onSwitchToIndoorPlan={onSwitchToIndoorPlan}
                isOrganizer={true}
              />

              {/* Event Logistics & Contingency Card */}
              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-600">
                  Event Setting & Contingency
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                    <div>
                      <span className="font-bold text-stone-900 block font-display">Venue Setting:</span>
                      <span className="text-stone-600">
                        {event.isOutdoor ? 'Outdoor Rooftop Terrace' : 'Covered Indoor Atrium'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onSwitchToIndoorPlan}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition ${
                        event.currentIndoorPlanActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {event.currentIndoorPlanActive ? 'Indoor Plan Active ✓' : 'Switch to Indoor Plan'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 text-stone-600 border border-stone-200/70">
                    <strong className="text-stone-900 block mb-0.5 font-display">Contingency Note:</strong>
                    {event.indoorVenueNote}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Activity Stream Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-800">
                      Live Activity Feed
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-0.5"
                  >
                    <span>View All ({activities.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3.5 space-y-2.5">
                  {activities.slice(0, 4).map((act) => {
                    const styling = getActivityStyling(act.type);
                    const Icon = styling.icon;
                    return (
                      <div
                        key={act.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50/80 border border-stone-100 text-xs hover:border-stone-200 transition"
                      >
                        <div className={`p-1.5 rounded-lg ${styling.iconBg} shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-stone-900 truncate font-display">
                              {act.title}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono shrink-0">
                              {act.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5 font-sans">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED EVENT ACTIVITY FEED */}
      {activeTab === 'activity' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Feed Controls */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-stone-900">
                    Event Activity Stream
                  </h3>
                  <p className="text-xs text-stone-500">
                    Real-time timeline of attendee check-ins, bingo stamps, and venue updates
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Live Streaming</span>
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity by name, action, or prompt..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-[#fbf9f5] text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                >
                  <span className="text-sm font-bold">×</span>
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-display">
              <button
                type="button"
                onClick={() => setActivityFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  activityFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({activities.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('checkin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  activityFilter === 'checkin'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>Check-Ins</span>
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('bingo')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  activityFilter === 'bingo'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>Bingo</span>
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('weather')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  activityFilter === 'weather'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <CloudSun className="w-3 h-3" />
                <span>Weather & Plan</span>
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('match')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  activityFilter === 'match'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Matches</span>
              </button>
            </div>
          </div>

          {/* Activity Items Feed */}
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
                <Activity className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <h4 className="font-display text-sm font-bold text-stone-800">No matching activities</h4>
                <p className="text-xs mt-1">
                  Try clearing your search query or choosing another category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActivityFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl hover:bg-amber-100"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredActivities.map((act) => {
                const styling = getActivityStyling(act.type);
                const Icon = styling.icon;

                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs hover:border-stone-300 transition text-xs flex items-start gap-3.5"
                  >
                    <div className="relative shrink-0 mt-0.5">
                      {act.attendeeAvatar ? (
                        <div className="relative">
                          <img
                            src={act.attendeeAvatar}
                            alt={act.attendeeName || 'Attendee'}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shadow-xs"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${styling.iconBg} ring-2 ring-white`}
                          >
                            <Icon className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl ${styling.iconBg} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-display text-sm font-bold text-stone-900 truncate">
                          {act.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{act.timestamp}</span>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-stone-600 leading-relaxed font-sans">
                        {act.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-stone-100">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[10px] border ${styling.badgeBg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styling.dotBg}`} />
                          <span>{act.badge || styling.icon.name}</span>
                        </span>

                        {act.attendeeName && (
                          <span className="text-[11px] text-stone-400 font-medium truncate max-w-[150px]">
                            {act.attendeeName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QR CHECK-IN SCREEN & ROSTER (Responsive 2-column layout on desktop) */}
      {activeTab === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in">
          {/* Big Venue QR Door Code */}
          <div className="lg:col-span-5 rounded-2xl border-2 border-amber-500/80 bg-white p-6 shadow-sm text-center">
            <div className="inline-flex p-3 rounded-2xl bg-amber-50 mb-2 border border-amber-100">
              <QrCode className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Venue Door Check-in QR
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Display this screen at the entrance for incoming attendees to scan with their phones.
            </p>

            {/* Generated Mock QR Pattern */}
            <div className="my-5 mx-auto w-48 h-48 bg-stone-900 p-3 rounded-2xl flex flex-col justify-between items-center shadow-md">
              <div className="w-full h-full border-4 border-dashed border-amber-400/80 rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-white">
                <div className="grid grid-cols-4 gap-1.5 w-32 h-32">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i * 7 + 3) % 2 === 0 ? 'bg-amber-100' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300">
                  MEETLY-{event.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{checkedInCount} of {totalRSVPs} already checked in</span>
            </div>
          </div>

          {/* Attendee Roster Check-in Desk */}
          <div className="lg:col-span-7 rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-700">
                Manual Check-in Roster ({attendees.length})
              </h4>
              <span className="text-[11px] text-stone-400">1-tap toggle</span>
            </div>

            <div className="mt-3.5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 bg-[#fbf9f5] hover:bg-stone-100/60 transition"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-display text-sm font-bold text-stone-900 truncate">
                        {attendee.name}
                      </div>
                      <div className="text-xs text-stone-500 truncate">
                        {attendee.title}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleCheckIn(attendee.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                      attendee.checkedIn
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{attendee.checkedIn ? 'Checked In' : 'Check In'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EDIT MEETUP */}
      {activeTab === 'edit' && (
        <form
          onSubmit={handleSaveEvent}
          className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in text-xs sm:text-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-display text-base font-bold text-stone-900">
              Meetup Parameters & Location
            </h3>
            <span className="text-xs text-stone-400">All fields update in real time</span>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
              Meetup Title
            </label>
            <input
              type="text"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fbf9f5]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Date & Time
              </label>
              <input
                type="text"
                value={editFormData.dateTime}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, dateTime: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fbf9f5]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Max Capacity
              </label>
              <input
                type="number"
                value={editFormData.capacity}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    capacity: parseInt(e.target.value, 10) || 30,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fbf9f5]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Venue Name
              </label>
              <input
                type="text"
                value={editFormData.venueName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, venueName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fbf9f5]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Venue Address
              </label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, address: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#fbf9f5]"
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Latitude (Open-Meteo)
              </label>
              <input
                type="number"
                step="0.0001"
                value={editFormData.coordinates.lat}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    coordinates: {
                      ...editFormData.coordinates,
                      lat: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-[#fbf9f5]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1 font-display text-xs">
                Longitude (Open-Meteo)
              </label>
              <input
                type="number"
                step="0.0001"
                value={editFormData.coordinates.lon}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    coordinates: {
                      ...editFormData.coordinates,
                      lon: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-[#fbf9f5]"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold active:scale-95 shadow-sm"
            >
              Save Parameters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
