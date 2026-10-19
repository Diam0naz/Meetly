/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Seeded mock data for Meetly
 * 12 realistic attendees, tags, event setup, and 25 bingo prompts.
 */

import { Attendee, BingoCell, MeetupEvent, ActivityItem } from './types';

export const PRESET_TAGS = [
  'Solana dev',
  'Design',
  'Funding',
  'Farming',
  'Marketing',
  'Hiring',
  'AI Engineering',
  'Product',
  'Community',
  'Growth',
  'Tokenomics',
  'Legal / Ops',
] as const;

export const INITIAL_EVENT: MeetupEvent = {
  id: 'meetup-sf-01',
  title: 'SF Founders & Builders Twilight Mixer',
  tagline: 'High-density curated matchmaking for Web3, AI & Product architects',
  dateTime: 'Tonight • 6:30 PM – 9:30 PM',
  venueName: 'The Greenhouse Commons & Rooftop Terrace',
  address: '450 Mission St, San Francisco, CA',
  coordinates: {
    lat: 37.7904,
    lon: -122.3995,
  },
  isFree: true,
  ticketPrice: 0,
  capacity: 35,
  isOutdoor: true,
  currentIndoorPlanActive: false,
  indoorVenueNote: 'Level 2 Glass Atrium & Heated Covered Veranda (Rain Contingency Active)',
  lastWeatherChecked: 'Just now',
};

export const SEEDED_ATTENDEES: Attendee[] = [
  {
    id: 'att-1',
    name: 'Ada Lovelace',
    title: 'Solana Protocol Core Contributor',
    company: 'Anza / Helios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Solana dev', 'Tokenomics'],
    lookingFor: ['Design', 'Growth'],
    vibe: 'deep', // Wants one good conversation
    pastMatches: ['att-6'], // Matched in past event with Jordan
    checkedIn: true,
    checkInTime: '6:32 PM',
    zone: 'Networking Corner',
    contact: {
      handle: '@adalove',
      telegram: 't.me/adalovelace_dev',
      twitter: 'x.com/adalovelace_dev',
      email: 'ada@helioslabs.xyz',
      linkedin: 'linkedin.com/in/ada-lovelace-core',
    },
    funFact: 'Has written smart contracts deployed on 4 L1 mainnets.',
    bingoTraits: [1, 4, 15, 22],
  },
  {
    id: 'att-2',
    name: 'Marcus Vance',
    title: 'Principal Product Designer & Design Systems',
    company: 'Studio Kinetic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Design', 'Product'],
    lookingFor: ['Solana dev', 'Funding'],
    vibe: 'deep',
    pastMatches: ['att-10'],
    checkedIn: true,
    checkInTime: '6:35 PM',
    zone: 'Stage',
    contact: {
      handle: '@marcusvance',
      telegram: 't.me/marcusv_design',
      twitter: 'x.com/marcusvance',
      email: 'marcus@studiokinetic.design',
      linkedin: 'linkedin.com/in/marcus-vance-design',
    },
    funFact: 'Designed mobile wallet interfaces used by over 2M users.',
    bingoTraits: [3, 7, 10, 18],
  },
  {
    id: 'att-3',
    name: 'Elena Rostova',
    title: 'AI Systems Architect & LLM Engineer',
    company: 'Cognition Core',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['AI Engineering', 'Solana dev'],
    lookingFor: ['Funding', 'Hiring'],
    vibe: 'broad', // Wants to meet many people
    pastMatches: [],
    checkedIn: true,
    checkInTime: '6:31 PM',
    zone: 'Networking Corner',
    contact: {
      handle: '@elenarostov',
      telegram: 't.me/elena_ai',
      twitter: 'x.com/elena_rostov_ai',
      email: 'elena@cognitioncore.ai',
      linkedin: 'linkedin.com/in/elena-rostova-ai',
    },
    funFact: 'Trained open-weights reasoning models running on consumer edge devices.',
    bingoTraits: [2, 8, 14, 21],
  },
  {
    id: 'att-4',
    name: 'Kenji Takahashi',
    title: 'Seed Partner & Angel Investor',
    company: 'Hyperplane Ventures',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Funding', 'Hiring'],
    lookingFor: ['AI Engineering', 'Solana dev'],
    vibe: 'deep',
    pastMatches: ['att-1'],
    checkedIn: true,
    checkInTime: '6:40 PM',
    zone: 'Patio Terrace',
    contact: {
      handle: '@kenjivc',
      telegram: 't.me/kenjitakahashi',
      twitter: 'x.com/kenjitakahashi_vc',
      email: 'kenji@hyperplane.vc',
      linkedin: 'linkedin.com/in/kenji-takahashi-sf',
    },
    funFact: 'Backed 14 founder teams out of early coffee shop chats.',
    bingoTraits: [5, 9, 12, 19],
  },
  {
    id: 'att-5',
    name: 'Chloe Dubois',
    title: 'Head of Growth & Viral Loops',
    company: 'PulseScale',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Growth', 'Marketing'],
    lookingFor: ['Product', 'Tokenomics'],
    vibe: 'broad',
    pastMatches: ['att-2'],
    checkedIn: true,
    checkInTime: '6:38 PM',
    zone: 'Food & Bar',
    contact: {
      handle: '@chloedubois',
      telegram: 't.me/chloe_growth',
      twitter: 'x.com/chloegrowth',
      email: 'chloe@pulsescale.io',
      linkedin: 'linkedin.com/in/chloedubois-growth',
    },
    funFact: 'Bootstrapped an open dev newsletter to 60k subscribers in 9 months.',
    bingoTraits: [6, 11, 17, 24],
  },
  {
    id: 'att-6',
    name: 'Jordan Miller',
    title: 'Token Engineer & DeFi Liquidity Strategist',
    company: 'Nexus Yield Labs',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Tokenomics', 'Farming'],
    lookingFor: ['Solana dev', 'Community'],
    vibe: 'broad',
    pastMatches: ['att-1'],
    checkedIn: true,
    checkInTime: '6:42 PM',
    zone: 'Stage',
    contact: {
      handle: '@jordanmiller',
      telegram: 't.me/jmiller_nexus',
      twitter: 'x.com/jordan_yield',
      email: 'jordan@nexusyield.io',
      linkedin: 'linkedin.com/in/jordanmiller-defi',
    },
    funFact: 'Simulated high-frequency automated liquidity pools in Julia and Rust.',
    bingoTraits: [1, 7, 16, 23],
  },
  {
    id: 'att-7',
    name: 'Amina Al-Mansoor',
    title: 'Director of Developer Relations & Ecosystem',
    company: 'Supercluster Foundation',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Community', 'Hiring'],
    lookingFor: ['Design', 'Marketing'],
    vibe: 'deep',
    pastMatches: [],
    checkedIn: true,
    checkInTime: '6:45 PM',
    zone: 'Networking Corner',
    contact: {
      handle: '@amina_devrel',
      telegram: 't.me/amina_community',
      twitter: 'x.com/aminadevrel',
      email: 'amina@supercluster.org',
      linkedin: 'linkedin.com/in/amina-al-mansoor',
    },
    funFact: 'Organized hackathons across 12 countries with 8,000+ total hackers.',
    bingoTraits: [4, 9, 13, 20],
  },
  {
    id: 'att-8',
    name: 'Mateo Morales',
    title: 'DeFi Yield Farmer & Smart Contract Auditor',
    company: 'Solstice Security',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Farming', 'Solana dev'],
    lookingFor: ['Legal / Ops', 'Funding'],
    vibe: 'broad',
    pastMatches: ['att-4'],
    checkedIn: true,
    checkInTime: '6:46 PM',
    zone: 'Food & Bar',
    contact: {
      handle: '@mateomorales',
      telegram: 't.me/mateo_security',
      twitter: 'x.com/mateomorales_sec',
      email: 'mateo@solsticesec.com',
      linkedin: 'linkedin.com/in/mateo-morales-audit',
    },
    funFact: 'Audited over $400M in locked TVL without an exploit.',
    bingoTraits: [2, 11, 15, 25],
  },
  {
    id: 'att-9',
    name: 'Sophie Lin',
    title: 'Tech GC & Regulatory Specialist',
    company: 'Decentral Law Partners',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Legal / Ops', 'Funding'],
    lookingFor: ['Farming', 'Tokenomics'],
    vibe: 'deep',
    pastMatches: [],
    checkedIn: true,
    checkInTime: '6:48 PM',
    zone: 'Patio Terrace',
    contact: {
      handle: '@sophielin_law',
      telegram: 't.me/sophielin_esq',
      twitter: 'x.com/sophielin_legal',
      email: 'sophie@decentrallaw.com',
      linkedin: 'linkedin.com/in/sophie-lin-legal',
    },
    funFact: 'Helped draft open-source token warranty frameworks adopted globally.',
    bingoTraits: [3, 10, 16, 22],
  },
  {
    id: 'att-10',
    name: 'Devon Hayes',
    title: 'VP of Product & AI Agents',
    company: 'Automata Works',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Product', 'AI Engineering'],
    lookingFor: ['Growth', 'Design'],
    vibe: 'deep',
    pastMatches: ['att-2'],
    checkedIn: true,
    checkInTime: '6:50 PM',
    zone: 'Networking Corner',
    contact: {
      handle: '@devonhayes',
      telegram: 't.me/devon_automata',
      twitter: 'x.com/devonhayes_pm',
      email: 'devon@automataworks.io',
      linkedin: 'linkedin.com/in/devon-hayes-product',
    },
    funFact: 'Built a multi-agent workflow that triages customer bug reports in 90 seconds.',
    bingoTraits: [5, 8, 17, 21],
  },
  {
    id: 'att-11',
    name: 'Zara Thorne',
    title: 'Web3 Brand & Guerrilla Marketer',
    company: 'Signal & Noise Studio',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Marketing', 'Community'],
    lookingFor: ['AI Engineering', 'Hiring'],
    vibe: 'broad',
    pastMatches: ['att-7'],
    checkedIn: false, // Arriving soon
    zone: 'Food & Bar',
    contact: {
      handle: '@zarathorne',
      telegram: 't.me/zara_signal',
      twitter: 'x.com/zarathorne_mktg',
      email: 'zara@signalnoise.agency',
      linkedin: 'linkedin.com/in/zara-thorne-marketing',
    },
    funFact: 'Created a viral interactive billboard during Solana Breakpoint in Lisbon.',
    bingoTraits: [6, 12, 18, 24],
  },
  {
    id: 'att-12',
    name: 'Lucas Ferreira',
    title: 'Head of Talent & Org Builder',
    company: 'Apex Founders Guild',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    canHelpWith: ['Hiring', 'Growth'],
    lookingFor: ['Solana dev', 'Product'],
    vibe: 'deep',
    pastMatches: [],
    checkedIn: true,
    checkInTime: '6:52 PM',
    zone: 'Stage',
    contact: {
      handle: '@lucasferreira',
      telegram: 't.me/lucas_apex',
      twitter: 'x.com/lucas_talent',
      email: 'lucas@apexguild.co',
      linkedin: 'linkedin.com/in/lucas-ferreira-talent',
    },
    funFact: 'Placed 40+ founding engineers into YC and early Solana ecosystem teams.',
    bingoTraits: [7, 14, 19, 25],
  },
];

export const BINGO_PROMPTS_POOL: string[] = [
  'Shipped a mainnet contract or app', // 1
  'Trained an LLM or custom agent in prod', // 2
  'Redesigned a full UX system this year', // 3
  'Spoke or presented at a tech conference', // 4
  'Angel invested in 2+ early startups', // 5
  'Grew an organic audience past 10,000', // 6
  'Designed a token model or staking curve', // 7
  'Prompt-engineered an autonomous pipeline', // 8
  'Organized a regional hackathon or meetup', // 9
  'Audited or reviewed smart contracts', // 10
  'Yield farmed during DeFi Summer or later', // 11
  'Closed a grant or pre-seed round', // 12
  'FREE COMMUNITY SPACE', // 13 (Center Free Space)
  'Hired founding engineer in under 30 days', // 14
  'Runs their own validator or staking node', // 15
  'Drafted SAFEs, SAFTs, or Cayman entities', // 16
  'Built an open-source tool with 300+ stars', // 17
  'Figma wizard with 50+ published components', // 18
  'Relocated cities to join a builder house', // 19
  'Manages an active Discord / TG with 1k+ members', // 20
  'Works fully remote across 3+ time zones', // 21
  'Won 1st or 2nd place in a major hackathon', // 22
  'Authored a technical whitepaper or spec', // 23
  'Ran a successful Kickstarter or crowd-sale', // 24
  'Uses Vim / Neovim / Helix daily as IDE', // 25
];

export function generateInitialBingoBoard(): BingoCell[] {
  return BINGO_PROMPTS_POOL.map((prompt, index) => {
    const isFree = index === 12;
    return {
      id: index + 1,
      prompt,
      isFreeSpace: isFree,
      completed: isFree,
      completedAttendeeName: isFree ? 'Meetly Community' : undefined,
      completedAt: isFree ? 'Welcome!' : undefined,
    };
  });
}

export const INITIAL_LEADERBOARD = [
  {
    attendeeId: 'att-1',
    name: 'Ada Lovelace',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    squaresCompleted: 6,
    linesCompleted: 1,
    rank: 1,
  },
  {
    attendeeId: 'att-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    squaresCompleted: 5,
    linesCompleted: 0,
    rank: 2,
  },
  {
    attendeeId: 'att-5',
    name: 'Chloe Dubois',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    squaresCompleted: 4,
    linesCompleted: 0,
    rank: 3,
  },
  {
    attendeeId: 'att-2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    squaresCompleted: 3,
    linesCompleted: 0,
    rank: 4,
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-7',
    type: 'checkin',
    title: 'Lucas Ferreira checked in',
    description: 'Scanned registration QR code at Entrance Desk',
    timestamp: '6:52 PM',
    attendeeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    attendeeName: 'Lucas Ferreira',
    badge: 'Check-in #11',
  },
  {
    id: 'act-6',
    type: 'bingo',
    title: 'Chloe Dubois stamped square #6',
    description: 'Verified prompt: "Grew an organic audience past 10,000" with Devon Hayes',
    timestamp: '6:49 PM',
    attendeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    attendeeName: 'Chloe Dubois',
    badge: 'Bingo Stamp',
  },
  {
    id: 'act-5',
    type: 'checkin',
    title: 'Amina Al-Mansoor checked in',
    description: 'Welcome pass verified at Door Station',
    timestamp: '6:45 PM',
    attendeeAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    attendeeName: 'Amina Al-Mansoor',
    badge: 'Check-in #10',
  },
  {
    id: 'act-4',
    type: 'bingo',
    title: 'Ada Lovelace completed a Bingo Line!',
    description: 'Achieved 5-in-a-row on diagonal axis (+50 points)',
    timestamp: '6:38 PM',
    attendeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    attendeeName: 'Ada Lovelace',
    badge: 'Bingo Line 🎯',
  },
  {
    id: 'act-3',
    type: 'checkin',
    title: 'Ada Lovelace checked in',
    description: 'First attendee checked in. Match engine paired 3 attendees.',
    timestamp: '6:32 PM',
    attendeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    attendeeName: 'Ada Lovelace',
    badge: 'Check-in #1',
  },
  {
    id: 'act-2',
    type: 'weather',
    title: 'Open-Meteo Weather Synced',
    description: 'Venue microclimate monitored: 21°C, 15% rain probability. Outdoor Terrace clear.',
    timestamp: '6:30 PM',
    badge: 'Forecast Ok',
  },
  {
    id: 'act-1',
    type: 'plan',
    title: 'Event check-in officially opened',
    description: 'SF Founders & Builders Twilight Mixer doors opened at The Greenhouse Commons',
    timestamp: '6:15 PM',
    badge: 'Doors Open',
  },
];

