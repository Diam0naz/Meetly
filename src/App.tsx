/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Meetly - Mobile-First PWA for Curated Small Meetups
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Shield,
  User,
  Calendar,
  X,
  Map,
  Trophy,
  CloudSun,
  Users,
} from 'lucide-react';
import {
  Attendee,
  BingoCell,
  LeaderboardEntry,
  MatchResult,
  MeetupEvent,
  WeatherData,
  ActivityItem,
  ActivityType,
} from './types';
import {
  INITIAL_EVENT,
  SEEDED_ATTENDEES,
  generateInitialBingoBoard,
  INITIAL_LEADERBOARD,
  INITIAL_ACTIVITIES,
} from './mockData';
import { getMatchesForAttendee } from './matchEngine';
import { fetchEventWeather, DEFAULT_FALLBACK_WEATHER } from './weather';
import { DemoBar } from './components/DemoBar';
import { Navigation, AttendeeTab } from './components/Navigation';
import { EventScreen } from './components/EventScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { VenueMap } from './components/VenueMap';
import { QRBingoGame } from './components/QRBingoGame';
import { WeatherScreen } from './components/WeatherScreen';
import { PostEventConnect } from './components/PostEventConnect';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AttendeeOnboarding } from './components/AttendeeOnboarding';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // --- Persistent & Reactive State ---
  const [event, setEvent] = useState<MeetupEvent>(INITIAL_EVENT);
  const [attendees, setAttendees] = useState<Attendee[]>(SEEDED_ATTENDEES);
  const [currentAttendeeId, setCurrentAttendeeId] = useState<string>('att-1');
  const [isOrganizerView, setIsOrganizerView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AttendeeTab>('event');
  const [currentMinute, setCurrentMinute] = useState<number>(20); // Default to Min 20 rotation for instant wow factor
  const [forceHighRainSim, setForceHighRainSim] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_FALLBACK_WEATHER);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [foundAttendeeIds, setFoundAttendeeIds] = useState<string[]>(['att-2']); // seeded with Marcus found
  const [bingoBoard, setBingoBoard] = useState<BingoCell[]>(generateInitialBingoBoard());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [highlightMapAttendeeId, setHighlightMapAttendeeId] = useState<string | null>(null);
  const [broadcastAlertToast, setBroadcastAlertToast] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Helper to log real-time actions to the Organizer Activity Feed
  const logActivity = (
    type: ActivityType,
    title: string,
    description: string,
    attendeeAvatar?: string,
    attendeeName?: string,
    badge?: string
  ) => {
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attendeeAvatar,
      attendeeName,
      badge,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Active Attendee Persona
  const currentAttendee = useMemo(() => {
    return (
      attendees.find((a) => a.id === currentAttendeeId) ||
      attendees[0] ||
      SEEDED_ATTENDEES[0]
    );
  }, [attendees, currentAttendeeId]);

  // Algorithmic 3 Matches for current attendee (pure function in matchEngine.ts)
  const currentMatches: MatchResult[] = useMemo(() => {
    return getMatchesForAttendee(currentAttendee, attendees, foundAttendeeIds);
  }, [currentAttendee, attendees, foundAttendeeIds]);

  // --- Weather Fetch & 30-Minute Polling Loop ---
  const loadWeather = async (forceSim: boolean = forceHighRainSim) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchEventWeather(
        event.coordinates.lat,
        event.coordinates.lon,
        forceSim
      );
      setWeather(data);
    } catch (err) {
      console.error('Weather load failed:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    loadWeather(forceHighRainSim);

    // Monitoring: re-check every 30 minutes while event is active
    const interval = setInterval(() => {
      loadWeather(forceHighRainSim);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [event.coordinates.lat, event.coordinates.lon, forceHighRainSim]);

  // When forceHighRainSim changes, trigger instant weather update
  const handleToggleRainSim = () => {
    const nextVal = !forceHighRainSim;
    setForceHighRainSim(nextVal);
    loadWeather(nextVal);

    logActivity(
      'weather',
      nextVal ? 'Weather Alert Triggered (>60% Rain)' : 'Weather Cleared to Baseline',
      nextVal
        ? 'Open-Meteo precipitation forecast rose to 78% for outdoor venue coordinates.'
        : 'Open-Meteo microclimate normalized: 15% rain probability.',
      undefined,
      undefined,
      nextVal ? 'High Rain Alert' : 'Weather Normal'
    );
  };

  // --- Organizer Actions ---
  const handleSwitchToIndoorPlan = () => {
    setEvent((prev) => ({
      ...prev,
      currentIndoorPlanActive: true,
      indoorVenueNote:
        'Level 2 Covered Glass Atrium & Heated Veranda (All sessions moved inside due to rain contingency)',
    }));

    logActivity(
      'plan',
      'Indoor Contingency Plan Activated',
      'Organizer switched venue setting to Level 2 Covered Glass Atrium & Heated Veranda due to weather forecast.',
      undefined,
      undefined,
      'Indoor Contingency'
    );

    setBroadcastAlertToast(
      '🌧️ Organizer Notice: Meetup shifted to Level 2 Glass Atrium & Covered Veranda due to rain risk!'
    );
  };

  const handleUpdateEvent = (updated: Partial<MeetupEvent>) => {
    setEvent((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleCheckIn = (attendeeId: string) => {
    const attendee = attendees.find((a) => a.id === attendeeId);
    if (!attendee) return;

    const willBeCheckedIn = !attendee.checkedIn;
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              checkedIn: willBeCheckedIn,
              checkInTime: willBeCheckedIn
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
            }
          : a
      )
    );

    if (willBeCheckedIn) {
      logActivity(
        'checkin',
        `${attendee.name} checked in`,
        `Checked in at Registration Station • Zone: ${attendee.zone}`,
        attendee.avatar,
        attendee.name,
        'Checked In'
      );
    } else {
      logActivity(
        'checkin',
        `${attendee.name} check-in undone`,
        `Registration status reset to unconfirmed by organizer`,
        attendee.avatar,
        attendee.name,
        'Status Reset'
      );
    }
  };

  // --- Attendee Actions ---
  const handleToggleFound = (matchedAttendeeId: string) => {
    const person = attendees.find((a) => a.id === matchedAttendeeId);
    if (foundAttendeeIds.includes(matchedAttendeeId)) {
      setFoundAttendeeIds(foundAttendeeIds.filter((id) => id !== matchedAttendeeId));
    } else {
      setFoundAttendeeIds([...foundAttendeeIds, matchedAttendeeId]);
      if (person) {
        setBroadcastAlertToast(`🎉 Marked ${person.name} as Found! Check 'People You Met'`);
        logActivity(
          'match',
          `${currentAttendee.name} met ${person.name}`,
          `Marked "Found Them" in Matches screen (${person.title})`,
          person.avatar,
          person.name,
          'Connection Met'
        );
      }
    }
  };

  const handleCompleteBingoSquare = (
    squareId: number,
    completedByAttendee: Attendee
  ) => {
    const square = bingoBoard.find((cell) => cell.id === squareId);

    logActivity(
      'bingo',
      `${currentAttendee.name} stamped square #${squareId}`,
      `Verified prompt: "${square?.prompt || 'Bingo Prompt'}" with ${completedByAttendee.name}`,
      completedByAttendee.avatar,
      completedByAttendee.name,
      'Bingo Stamp'
    );

    setBingoBoard((prev) =>
      prev.map((cell) =>
        cell.id === squareId
          ? {
              ...cell,
              completed: true,
              completedByAttendeeId: completedByAttendee.id,
              completedAttendeeName: completedByAttendee.name,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : cell
      )
    );

    // Update attendee leaderboard score
    setLeaderboard((prev) => {
      const exists = prev.some((e) => e.attendeeId === currentAttendee.id);
      if (exists) {
        return prev.map((entry) =>
          entry.attendeeId === currentAttendee.id
            ? { ...entry, squaresCompleted: entry.squaresCompleted + 1 }
            : entry
        );
      } else {
        return [
          ...prev,
          {
            attendeeId: currentAttendee.id,
            name: currentAttendee.name,
            avatar: currentAttendee.avatar,
            squaresCompleted: 1,
            linesCompleted: 0,
            rank: prev.length + 1,
          },
        ];
      }
    });
  };

  const handleOnboardingComplete = (newAttendee: Attendee) => {
    setAttendees([newAttendee, ...attendees]);
    setCurrentAttendeeId(newAttendee.id);
    setIsOnboardingOpen(false);
    setActiveTab('matches');

    logActivity(
      'checkin',
      `${newAttendee.name} joined & onboarded`,
      `New attendee onboarded in under 60s • 3 mutual matches computed`,
      newAttendee.avatar,
      newAttendee.name,
      'New Builder'
    );

    setBroadcastAlertToast(`🚀 Welcome, ${newAttendee.name.split(' ')[0]}! Your 3 matches are ready.`);
  };

  const handleResetDemo = () => {
    setEvent(INITIAL_EVENT);
    setAttendees(SEEDED_ATTENDEES);
    setCurrentAttendeeId('att-1');
    setCurrentMinute(20);
    setForceHighRainSim(false);
    setFoundAttendeeIds(['att-2']);
    setBingoBoard(generateInitialBingoBoard());
    setLeaderboard(INITIAL_LEADERBOARD);
    setActivities(INITIAL_ACTIVITIES);
    setBroadcastAlertToast('Demo state reset to initial seed.');
    loadWeather(false);
  };

  const totalBingoCompleted = bingoBoard.filter((b) => b.completed).length;

  // Desktop navigation tabs for attendee view
  const attendeeNavTabs = [
    { id: 'event' as AttendeeTab, label: 'Event', icon: Calendar },
    {
      id: 'matches' as AttendeeTab,
      label: 'Matches',
      icon: Sparkles,
      badge: `${foundAttendeeIds.filter((id) => currentMatches.some((m) => m.matchedAttendee.id === id)).length}/${currentMatches.length}`,
    },
    { id: 'map' as AttendeeTab, label: 'Venue Map', icon: Map },
    { id: 'game' as AttendeeTab, label: 'QR Bingo', icon: Trophy },
    {
      id: 'weather' as AttendeeTab,
      label: 'Weather',
      icon: CloudSun,
      alert: weather.rainProbability > 60 && event.isOutdoor && !event.currentIndoorPlanActive,
    },
    { id: 'connect' as AttendeeTab, label: 'People You Met', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-stone-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Demo Simulation Controls Bar fixed top-right */}
      <DemoBar
        isOrganizerView={isOrganizerView}
        onToggleView={(val) => setIsOrganizerView(val)}
        currentMinute={currentMinute}
        onSetMinute={(min) => setCurrentMinute(min)}
        attendees={attendees}
        currentAttendeeId={currentAttendeeId}
        onSelectAttendee={(id) => setCurrentAttendeeId(id)}
        forceHighRainSim={forceHighRainSim}
        onToggleRainSim={handleToggleRainSim}
        onResetDemo={handleResetDemo}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Top App Header: Full-width responsive with desktop navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-base shadow-sm font-display tracking-tight">
              M
            </div>
            <div>
              <span className="text-lg font-extrabold text-stone-950 tracking-tight leading-none block font-display">
                Meetly
              </span>
              <span className="text-[11px] text-stone-600 font-medium leading-none block mt-0.5">
                {isOrganizerView ? 'Organizer Dashboard' : `${event.title}`}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links for Attendees */}
          {!isOrganizerView && !isOnboardingOpen && (
            <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 font-display">
              {attendeeNavTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setHighlightMapAttendeeId(null);
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-amber-600' : 'text-stone-500'
                      }`}
                    />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-200">
                        {tab.badge}
                      </span>
                    )}
                    {tab.alert && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Role Switcher & PWA */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Quick role toggle */}
            <button
              onClick={() => setIsOrganizerView(!isOrganizerView)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 px-3 py-1.5 rounded-xl transition active:scale-95 font-display"
            >
              {isOrganizerView ? (
                <>
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Switch to Attendee</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Organizer Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Broadcast Notification Toast */}
      {broadcastAlertToast && (
        <div className="w-full max-w-2xl mx-auto px-4 mt-4 z-20">
          <div className="rounded-2xl bg-stone-900 text-white p-3.5 shadow-lg border border-amber-500/40 flex items-start justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-snug text-stone-100">{broadcastAlertToast}</p>
            </div>
            <button
              onClick={() => setBroadcastAlertToast(null)}
              className="text-stone-400 hover:text-white ml-3 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport: Full Width Dashboard & Mobile Responsive */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 flex-1">
        {isOnboardingOpen ? (
          <AttendeeOnboarding
            onComplete={handleOnboardingComplete}
            onCancel={() => setIsOnboardingOpen(false)}
            existingCount={attendees.length}
          />
        ) : isOrganizerView ? (
          /* --- ORGANIZER DASHBOARD (Full desktop width & clean mobile UX) --- */
          <OrganizerDashboard
            event={event}
            onUpdateEvent={handleUpdateEvent}
            attendees={attendees}
            onToggleCheckIn={handleToggleCheckIn}
            weather={weather}
            isLoadingWeather={isLoadingWeather}
            onRefreshWeather={() => loadWeather(forceHighRainSim)}
            onSwitchToIndoorPlan={handleSwitchToIndoorPlan}
            totalBingoSquaresCompleted={totalBingoCompleted}
            activities={activities}
          />
        ) : (
          /* --- ATTENDEE VIEWS BY TAB --- */
          <>
            {activeTab === 'event' && (
              <EventScreen
                event={event}
                currentAttendee={currentAttendee}
                matches={currentMatches}
                weather={weather}
                isLoadingWeather={isLoadingWeather}
                onRefreshWeather={() => loadWeather(forceHighRainSim)}
                onNavigateToMatches={() => setActiveTab('matches')}
                onNavigateToMap={() => setActiveTab('map')}
                onNavigateToGame={() => setActiveTab('game')}
                currentMinute={currentMinute}
              />
            )}

            {activeTab === 'matches' && (
              <MatchesScreen
                currentAttendee={currentAttendee}
                matches={currentMatches}
                onToggleFound={handleToggleFound}
                onNavigateToMapWithAttendee={(attendeeId) => {
                  setHighlightMapAttendeeId(attendeeId);
                  setActiveTab('map');
                }}
                onNavigateToConnect={() => setActiveTab('connect')}
                currentMinute={currentMinute}
                onGoToMap={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'map' && (
              <VenueMap
                currentAttendee={currentAttendee}
                matches={currentMatches}
                allAttendees={attendees}
                highlightAttendeeId={highlightMapAttendeeId}
                onSelectAttendee={(id) => {
                  setHighlightMapAttendeeId(id);
                }}
                onToggleFound={handleToggleFound}
              />
            )}

            {activeTab === 'game' && (
              <QRBingoGame
                currentAttendee={currentAttendee}
                allAttendees={attendees}
                bingoBoard={bingoBoard}
                onCompleteSquare={handleCompleteBingoSquare}
                leaderboard={leaderboard}
              />
            )}

            {activeTab === 'weather' && (
              <WeatherScreen
                weather={weather}
                event={event}
                isLoading={isLoadingWeather}
                onRefresh={() => loadWeather(forceHighRainSim)}
                onSwitchToIndoorPlan={handleSwitchToIndoorPlan}
                isOrganizer={false}
              />
            )}

            {activeTab === 'connect' && (
              <PostEventConnect
                currentAttendee={currentAttendee}
                matches={currentMatches}
                allAttendees={attendees}
                foundAttendeeIds={foundAttendeeIds}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Tab Bar Navigation for Mobile Attendees */}
      {!isOrganizerView && !isOnboardingOpen && (
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setHighlightMapAttendeeId(null);
            setActiveTab(tab);
          }}
          matchesCount={currentMatches.length}
          foundCount={
            foundAttendeeIds.filter((id) =>
              currentMatches.some((m) => m.matchedAttendee.id === id)
            ).length
          }
          hasWeatherAlert={
            weather.rainProbability > 60 &&
            event.isOutdoor &&
            !event.currentIndoorPlanActive
          }
        />
      )}
    </div>
  );
}
