export type VibePreference = 'deep' | 'broad'; // 'deep' = Find one good conversation, 'broad' = Meet many new people

export interface Attendee {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar: string;
  canHelpWith: string[]; // exactly 2 tags
  lookingFor: string[]; // exactly 2 tags
  vibe: VibePreference;
  pastMatches: string[]; // Attendee IDs previously matched at past meetups
  checkedIn: boolean;
  checkInTime?: string;
  zone: string; // e.g. "Networking Corner", "Stage", "Food & Bar", "Patio Terrace"
  contact: {
    handle: string;
    telegram?: string;
    twitter?: string;
    email?: string;
    linkedin?: string;
  };
  funFact: string;
  bingoTraits: number[]; // Prompt IDs this person satisfies (1-25)
}

export interface MatchResult {
  matchedAttendee: Attendee;
  score: number;
  reason: string;
  found: boolean;
  foundAt?: string;
  isTopMatchHighlight: boolean;
  scoreBreakdown: {
    mutualComplementarity: number; // 3 x count
    sharedInterests: number; // 1 x count
    pastMatchPenalty: number; // -2 x count
  };
}

export interface MeetupEvent {
  id: string;
  title: string;
  tagline: string;
  dateTime: string;
  venueName: string;
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  isFree: boolean;
  ticketPrice?: number;
  capacity: number;
  isOutdoor: boolean;
  currentIndoorPlanActive: boolean;
  indoorVenueNote: string;
  lastWeatherChecked?: string;
}

export interface WeatherData {
  temperature: number; // Celsius
  weatherCode: number;
  weatherDescription: string;
  rainProbability: number; // 0 - 100%
  windSpeed: number; // km/h
  isDay: boolean;
  highRainAlert: boolean;
  isFallback?: boolean;
  lastUpdated: string;
}

export interface BingoCell {
  id: number; // 1 to 25 (index 12 is FREE SPACE at center)
  prompt: string;
  isFreeSpace?: boolean;
  completed: boolean;
  completedByAttendeeId?: string;
  completedAttendeeName?: string;
  completedAt?: string;
}

export interface LeaderboardEntry {
  attendeeId: string;
  name: string;
  avatar: string;
  squaresCompleted: number;
  linesCompleted: number;
  rank: number;
}

export type ActivityType = 'checkin' | 'bingo' | 'weather' | 'plan' | 'match';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  attendeeAvatar?: string;
  attendeeName?: string;
  badge?: string;
}

