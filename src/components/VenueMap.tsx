/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Users,
  Sparkles,
  CheckCircle,
  Coffee,
  Mic,
  Sun,
  DoorOpen,
  Shirt,
  Wind,
  Droplets,
  Snowflake,
} from 'lucide-react';
import { Attendee, MatchResult } from '../types';

interface VenueMapProps {
  currentAttendee: Attendee;
  matches: MatchResult[];
  allAttendees: Attendee[];
  highlightAttendeeId?: string | null;
  onSelectAttendee?: (attendeeId: string) => void;
  onToggleFound?: (attendeeId: string) => void;
}

interface ZoneInfo {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  darkBgColor: string;
  climateNote: string;
  clothingTip: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const VENUE_ZONES: ZoneInfo[] = [
  {
    id: 'Stage',
    name: 'Main Stage & Talks',
    description: 'Fireside chats, founder demos & mic area',
    icon: Mic,
    color: 'text-stone-800 dark:text-stone-100',
    bgColor: 'fill-stone-100/95 stroke-stone-300',
    darkBgColor: 'dark:fill-stone-800/90 dark:stroke-stone-700',
    climateNote: 'Indoor AC cooled to 19°C for stage lights',
    clothingTip: 'Crisp AC while seated: Cardigan, blazer, or knit sweater recommended.',
    x: 40,
    y: 40,
    w: 220,
    h: 120,
  },
  {
    id: 'Food & Bar',
    name: 'Food & Bar',
    description: 'Artisan bites, coffee & bar tables',
    icon: Coffee,
    color: 'text-amber-800 dark:text-amber-300',
    bgColor: 'fill-amber-50/90 stroke-amber-300',
    darkBgColor: 'dark:fill-amber-950/40 dark:stroke-amber-800',
    climateNote: 'Transition zone with pleasant 21°C warmth',
    clothingTip: 'Hands-free attire with deep pockets for phones & drink napkins.',
    x: 300,
    y: 40,
    w: 220,
    h: 120,
  },
  {
    id: 'Networking Corner',
    name: 'Networking Corner',
    description: 'High-top collaboration pods & whiteboard wall',
    icon: Users,
    color: 'text-orange-900 dark:text-orange-300',
    bgColor: 'fill-orange-50/80 stroke-orange-300',
    darkBgColor: 'dark:fill-orange-950/40 dark:stroke-orange-800',
    climateNote: 'High human density (~23°C effective heat)',
    clothingTip: 'Shed outer layers: Breathable cotton/linen tops with rollable sleeves.',
    x: 40,
    y: 190,
    w: 220,
    h: 130,
  },
  {
    id: 'Patio Terrace',
    name: 'Garden Patio (Outdoor)',
    description: 'Open-air lounge & sunset view terrace',
    icon: Sun,
    color: 'text-emerald-800 dark:text-emerald-300',
    bgColor: 'fill-emerald-50/80 stroke-emerald-300',
    darkBgColor: 'dark:fill-emerald-950/40 dark:stroke-emerald-800',
    climateNote: 'Open-air evening breeze (~12-24 km/h)',
    clothingTip: 'Windbreaker overshirt or light jacket; sunglasses for twilight.',
    x: 300,
    y: 190,
    w: 220,
    h: 130,
  },
  {
    id: 'Check-in Desk',
    name: 'Registration & Pass Desk',
    description: 'Welcome check-in & Meetly NFC badge station',
    icon: DoorOpen,
    color: 'text-stone-700 dark:text-stone-300',
    bgColor: 'fill-stone-100 stroke-stone-300',
    darkBgColor: 'dark:fill-stone-800 stroke-stone-700',
    climateNote: 'Entryway draft zone with frequent door traffic',
    clothingTip: 'Easy-access zippered layer for quick badge scan.',
    x: 170,
    y: 350,
    w: 220,
    h: 70,
  },
];

const ZONE_PIN_OFFSETS: Record<string, { x: number; y: number }[]> = {
  Stage: [
    { x: 90, y: 90 },
    { x: 150, y: 100 },
    { x: 200, y: 80 },
  ],
  'Food & Bar': [
    { x: 350, y: 90 },
    { x: 420, y: 100 },
    { x: 480, y: 80 },
  ],
  'Networking Corner': [
    { x: 90, y: 250 },
    { x: 150, y: 260 },
    { x: 210, y: 240 },
  ],
  'Patio Terrace': [
    { x: 350, y: 250 },
    { x: 410, y: 260 },
    { x: 470, y: 240 },
  ],
  'Check-in Desk': [
    { x: 280, y: 385 },
  ],
};

export const VenueMap: React.FC<VenueMapProps> = ({
  currentAttendee,
  matches,
  allAttendees,
  highlightAttendeeId,
  onSelectAttendee,
  onToggleFound,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activePinAttendeeId, setActivePinAttendeeId] = useState<string | null>(
    highlightAttendeeId || matches[0]?.matchedAttendee.id || null
  );

  const activeAttendee = allAttendees.find((a) => a.id === activePinAttendeeId);
  const activeMatch = matches.find((m) => m.matchedAttendee.id === activePinAttendeeId);

  const attendeesInSelectedZone = allAttendees.filter(
    (a) => selectedZone === 'all' || a.zone === selectedZone
  );

  const selectedZoneInfo = VENUE_ZONES.find((z) => z.id === selectedZone);

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800 px-3 py-1 rounded-full font-display">
            Interactive Venue
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1.5">
            Venue Floor Plan & Microclimates
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1">
            Explore active zones, locate match coordinates, and check area clothing suggestions
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700 px-4 py-2 rounded-2xl shadow-xs self-start sm:self-auto font-display">
          <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>The Greenhouse Commons</span>
        </div>
      </div>

      {/* Zone Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-sm font-display">
        <button
          onClick={() => setSelectedZone('all')}
          className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition ${
            selectedZone === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          All Venue Zones
        </button>
        {VENUE_ZONES.filter((z) => z.id !== 'Check-in Desk').map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedZone === zone.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>{zone.name.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Area Clothing & Microclimate Tip Banner (Contextual to Selected Zone) */}
      {selectedZoneInfo && (
        <div className="rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200">
                  {selectedZoneInfo.name} Comfort Tip
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-400 font-semibold bg-amber-200/60 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                  {selectedZoneInfo.climateNote}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1">
                {selectedZoneInfo.clothingTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Layout on Desktop: 8 cols for Map, 4 cols for Selected Profile & Zone Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Map Section */}
        <div className="lg:col-span-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 sm:p-6 shadow-xs overflow-hidden">
          <div className="w-full aspect-[560/440] relative bg-[#faf8f4] dark:bg-stone-950 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-850">
            <svg
              viewBox="0 0 560 440"
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floor grid pattern */}
              <defs>
                <pattern
                  id="floorGridWarm"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#eae6df"
                    strokeWidth="1"
                    className="dark:stroke-stone-850"
                  />
                </pattern>
              </defs>
              <rect width="560" height="440" fill="url(#floorGridWarm)" />

              {/* Exterior boundary */}
              <rect
                x="20"
                y="20"
                width="520"
                height="400"
                rx="16"
                fill="none"
                stroke="#d6d3ce"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="dark:stroke-stone-700"
              />

              {/* Venue Zones */}
              {VENUE_ZONES.map((zone) => {
                const isZoneActive =
                  selectedZone === 'all' || selectedZone === zone.id;

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className="cursor-pointer transition-opacity"
                    opacity={isZoneActive ? 1 : 0.35}
                  >
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.w}
                      height={zone.h}
                      rx="12"
                      className={`${zone.bgColor} stroke-1.5 transition`}
                    />

                    {/* Zone Labels */}
                    <text
                      x={zone.x + 14}
                      y={zone.y + 24}
                      className="text-[13px] font-bold fill-stone-900 pointer-events-none"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="700"
                    >
                      {zone.name}
                    </text>
                    <text
                      x={zone.x + 14}
                      y={zone.y + 42}
                      className="text-[10px] font-medium fill-stone-600 pointer-events-none"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {zone.description.slice(0, 32)}...
                    </text>
                  </g>
                );
              })}

              {/* "You Are Here" Pin with Warm Amber Pulse */}
              {(() => {
                const userZone = currentAttendee.zone;
                const coords = ZONE_PIN_OFFSETS[userZone]?.[0] || { x: 100, y: 250 };
                return (
                  <g className="cursor-pointer">
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="18"
                      className="fill-amber-500/25 animate-ping"
                    />
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="10"
                      className="fill-amber-600 stroke-2 stroke-white dark:stroke-stone-900"
                    />
                    <text
                      x={coords.x}
                      y={coords.y - 14}
                      textAnchor="middle"
                      className="text-[11px] font-extrabold fill-stone-900 dark:fill-stone-100"
                      fontFamily="Space Grotesk, sans-serif"
                    >
                      YOU (Here)
                    </text>
                  </g>
                );
              })()}

              {/* Match Pins */}
              {matches.map((match, idx) => {
                const person = match.matchedAttendee;
                const zone = person.zone;
                const offsets = ZONE_PIN_OFFSETS[zone] || [{ x: 150, y: 250 }];
                const pinPos = offsets[(idx + 1) % offsets.length] || offsets[0];
                const isSelected = activePinAttendeeId === person.id;

                return (
                  <g
                    key={`pin-${person.id}`}
                    onClick={() => setActivePinAttendeeId(person.id)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={pinPos.x}
                      cy={pinPos.y}
                      r={isSelected ? 16 : 13}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-amber-600 stroke-3 stroke-white drop-shadow-md'
                          : match.found
                          ? 'fill-emerald-600 stroke-2 stroke-white'
                          : 'fill-stone-900 dark:fill-stone-100 stroke-2 stroke-white dark:stroke-stone-900'
                      }`}
                    />

                    <text
                      x={pinPos.x}
                      y={pinPos.y + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-black pointer-events-none ${
                        isSelected || match.found ? 'fill-white' : 'fill-white dark:fill-stone-950'
                      }`}
                      fontFamily="Space Grotesk, sans-serif"
                    >
                      #{idx + 1}
                    </text>

                    {/* Attendee Name Tag */}
                    <g
                      transform={`translate(${pinPos.x - 38}, ${pinPos.y - 32})`}
                      className="pointer-events-none"
                    >
                      <rect
                        width="76"
                        height="20"
                        rx="6"
                        className={`${
                          isSelected ? 'fill-amber-700' : 'fill-stone-900/90 dark:fill-stone-800'
                        }`}
                      />
                      <text
                        x="38"
                        y="14"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-white"
                        fontFamily="Space Grotesk, sans-serif"
                      >
                        {person.name.split(' ')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Selected Person Spotlight & Zone Roster */}
        <div className="lg:col-span-4 space-y-5">
          {/* Spotlight Card */}
          {activeAttendee && (
            <div className="rounded-3xl border-2 border-amber-500/80 bg-white dark:bg-stone-900 p-5 shadow-sm animate-in fade-in space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeAttendee.avatar}
                    alt={activeAttendee.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                        {activeAttendee.name}
                      </h4>
                      {activeMatch && (
                        <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-display">
                          Match #{matches.findIndex((m) => m.matchedAttendee.id === activeAttendee.id) + 1}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-1 font-sans">
                      {activeAttendee.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>In {activeAttendee.zone}</span>
                    </div>
                  </div>
                </div>

                {activeMatch && (
                  <button
                    type="button"
                    onClick={() => onToggleFound?.(activeAttendee.id)}
                    className={`p-2.5 rounded-2xl text-xs font-bold transition ${
                      activeMatch.found
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                    title={activeMatch.found ? 'Found!' : 'Mark Found'}
                  >
                    <CheckCircle className={`w-5 h-5 ${activeMatch.found ? 'text-emerald-700 dark:text-emerald-400' : ''}`} />
                  </button>
                )}
              </div>

              {activeMatch && (
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-850 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/40">
                  <strong className="text-amber-800 dark:text-amber-400 font-display">Match Context:</strong> {activeMatch.reason}
                </p>
              )}

              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 dark:text-stone-400 pt-1">
                <span>Can help: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{activeAttendee.canHelpWith.join(', ')}</strong></span>
                {onSelectAttendee && (
                  <button
                    onClick={() => onSelectAttendee(activeAttendee.id)}
                    className="text-amber-700 dark:text-amber-400 font-bold hover:underline font-display"
                  >
                    Profile &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Zone Roster List */}
          <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Attendees in {selectedZone === 'all' ? 'All Zones' : selectedZone} ({attendeesInSelectedZone.length})
              </h4>
              <span className="text-xs text-stone-400">Tap to locate</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {attendeesInSelectedZone.map((attendee) => {
                const isMatch = matches.some((m) => m.matchedAttendee.id === attendee.id);
                const isSelected = activePinAttendeeId === attendee.id;
                return (
                  <div
                    key={attendee.id}
                    onClick={() => setActivePinAttendeeId(attendee.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 text-sm ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 font-bold text-amber-950 dark:text-amber-200'
                        : 'border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div className="truncate flex-1">
                      <div className="truncate font-semibold font-display">{attendee.name}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {attendee.zone}
                      </div>
                    </div>
                    {isMatch && (
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
