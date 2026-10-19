/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Clothing & Personal Comfort Recommendation Engine
 * Analyzes real-time meteorology (temperature, wind, precipitation, sun/sunset)
 * cross-referenced with venue area microclimates (outdoor patio vs air-conditioned stage vs active networking pod)
 * to deliver tailored clothing recommendations for maximum personal comfort.
 */

import { WeatherData } from './types';

export type ComfortProfile = 'balanced' | 'runs_cold' | 'runs_warm';

export interface AreaClothingAdvice {
  areaId: string;
  areaName: string;
  environment: 'outdoor' | 'indoor_ac' | 'indoor_active' | 'transition';
  feltTemperature: number; // in Celsius
  climateNote: string;
  clothingTip: string;
  iconName: 'sun' | 'wind' | 'cloud-rain' | 'snowflake' | 'thermometer' | 'shirt';
  recommendedItems: string[];
}

export interface ClothingRecommendation {
  overallSummary: string;
  comfortIndex: string;
  effectiveFeltTemp: number;
  comfortProfile: ComfortProfile;
  keyCategories: {
    topAndLayers: {
      title: string;
      advice: string;
      examples: string[];
    };
    bottoms: {
      title: string;
      advice: string;
      examples: string[];
    };
    footwear: {
      title: string;
      advice: string;
      examples: string[];
    };
    weatherAccessories: {
      title: string;
      advice: string;
      examples: string[];
    };
  };
  areaTips: AreaClothingAdvice[];
  quickPicks: string[];
}

export function generateClothingRecommendations(
  weather: WeatherData,
  isIndoorPlanActive: boolean = false,
  profile: ComfortProfile = 'balanced'
): ClothingRecommendation {
  const { temperature, rainProbability, windSpeed, weatherCode } = weather;

  // Temperature adjustments based on profile
  const profileOffset = profile === 'runs_cold' ? -3 : profile === 'runs_warm' ? 3 : 0;
  const feltOutdoorTemp = Math.round(temperature - (windSpeed > 18 ? 2 : 0) + profileOffset);

  // Determine climate conditions
  const isCold = feltOutdoorTemp < 15;
  const isMild = feltOutdoorTemp >= 15 && feltOutdoorTemp <= 22;
  const isWarm = feltOutdoorTemp > 22;
  const isHighRain = rainProbability >= 60;
  const isBreezy = windSpeed >= 18;

  // Key categories
  let topAdvice = '';
  let topExamples: string[] = [];

  let bottomsAdvice = '';
  let bottomsExamples: string[] = [];

  let footwearAdvice = 'Comfortable walking sneakers or tailored leather loafers. You will navigate across multiple venue zones throughout the evening.';
  let footwearExamples = ['Cushioned sneakers', 'Breathable loafers', 'Low-profile slip-ons'];

  let accessoriesAdvice = '';
  let accessoriesExamples: string[] = [];

  if (isCold) {
    topAdvice = 'Multi-layering is vital. Start with a soft merino or cotton base, topped with a mid-layer sweater, and a tailored windbreaker or structured jacket.';
    topExamples = ['Merino wool knit', 'Over-shirt / chore jacket', 'Lightweight insulated coat'];
    bottomsAdvice = 'Heavyweight cotton chinos, relaxed selvedge denim, or tailored wool-blend trousers to block evening drafts.';
    bottomsExamples = ['Tailored chinos', 'Structured denim', 'Wool-blend trousers'];
  } else if (isWarm) {
    topAdvice = 'Light, breathable natural fibers (linen, lightweight cotton, or bamboo). Keep a light cardigan or knit on hand for the heavily air-conditioned Main Stage.';
    topExamples = ['Linen button-down', 'Breathable cotton tee', 'Ultra-light unbuttoned overshirt'];
    bottomsAdvice = 'Lightweight relaxed chinos, breathable linen trousers, or comfortable dark jeans.';
    bottomsExamples = ['Relaxed linen trousers', 'Stretch lightweight chinos', 'Breathable dark denim'];
  } else {
    // Mild (16 - 22°C) - Standard evening mixer weather
    topAdvice = 'Smart modular layering: A crisp breathable t-shirt or polo base beneath a light bomber, unstructured blazer, or fine-knit cardigan that can easily be taken off.';
    topExamples = ['Fine-knit cardigan', 'Lightweight Harrington jacket', 'Unstructured casual blazer', 'Soft organic cotton tee'];
    bottomsAdvice = 'Medium-weight chinos, tailored trousers, or comfortable clean denim for effortless movement.';
    bottomsExamples = ['Medium-weight chinos', 'Relaxed tailored slacks', 'Comfort-stretch jeans'];
  }

  // Accessories
  if (isHighRain && !isIndoorPlanActive) {
    accessoriesAdvice = 'High rain probability (>60%): Carry a compact umbrella and wear water-resistant outer layers if mingling on the outdoor terrace.';
    accessoriesExamples = ['Compact umbrella', 'Water-repellent jacket shell', 'Waterproof phone sleeve'];
  } else if (isBreezy) {
    accessoriesAdvice = 'Evening terrace breeze detected: A light scarf or wind-blocking collar will keep you cozy during twilight drinks.';
    accessoriesExamples = ['Lightweight neck scarf', 'Wind-resistant shell', 'UV sunglasses for sunset'];
  } else {
    accessoriesAdvice = 'Clear skies with pleasant conditions: Sunglasses recommended for golden hour terrace views. A minimalist messenger or shoulder strap for hands-free networking.';
    accessoriesExamples = ['UV sunglasses', 'Crossbody / card pouch', 'Breathable light layer'];
  }

  if (isHighRain && !accessoriesExamples.includes('Compact umbrella')) {
    accessoriesExamples.unshift('Compact umbrella');
  }

  // Area-specific microclimate clothing guidance
  const areaTips: AreaClothingAdvice[] = [
    {
      areaId: 'Patio Terrace',
      areaName: isIndoorPlanActive ? 'Garden Patio (Moved Indoors)' : 'Garden Patio & Rooftop Terrace (Outdoor)',
      environment: 'outdoor',
      feltTemperature: isIndoorPlanActive ? 21 : feltOutdoorTemp,
      climateNote: isIndoorPlanActive
        ? 'Relocated to Level 2 Glass Atrium: Constant 21°C climate controlled environment.'
        : `Open-air rooftop: ${temperature}°C ambient, ${windSpeed} km/h evening breeze.${isHighRain ? ' Rain risk active.' : ' Cools down by ~2°C after twilight.'}`,
      clothingTip: isIndoorPlanActive
        ? 'Comfortable room-temperature attire. Standard light layers.'
        : isHighRain
        ? '⚠️ Keep a water-resistant layer handy or stay under the glass pergola canopy until rain clears.'
        : isBreezy
        ? 'Wind-resistant light jacket or zipped sweater. Outdoor air feels cooler than the indoor halls.'
        : 'Light overshirt or cardigan for twilight. Great for sunglasses during golden hour.',
      iconName: isHighRain ? 'cloud-rain' : isBreezy ? 'wind' : 'sun',
      recommendedItems: isHighRain
        ? ['Water-resistant windbreaker', 'Compact umbrella', 'Dark footwear']
        : ['Light knit cardigan', 'Windbreaker overshirt', 'Sunset shades'],
    },
    {
      areaId: 'Stage',
      areaName: 'Main Stage & Talks (Indoor AC)',
      environment: 'indoor_ac',
      feltTemperature: profile === 'runs_cold' ? 18 : 20,
      climateNote: 'Commercial HVAC cooling: Crisp 19°C–20°C ambient with steady air circulation to counter high stage lighting heat.',
      clothingTip:
        'Indoor AC feels noticeably colder when sitting stationary during founder pitches. Put on your cardigan, blazer, or sweater here.',
      iconName: 'snowflake',
      recommendedItems: ['Unstructured blazer', 'Knit sweater / wrap', 'Layered overshirt'],
    },
    {
      areaId: 'Networking Corner',
      areaName: 'Networking Corner (High Energy Pods)',
      environment: 'indoor_active',
      feltTemperature: profile === 'runs_warm' ? 24 : 22,
      climateNote: 'High attendee density & standing discussions: Effective temperature is 2°C–3°C warmer due to body heat.',
      clothingTip:
        'Shed heavy outer layers! Breathable base layers (cotton or linen) with rollable sleeves will keep you cool during dynamic 1-on-1 chats.',
      iconName: 'shirt',
      recommendedItems: ['Breathable cotton tee / polo', 'Rollable sleeves', 'Comfortable standing shoes'],
    },
    {
      areaId: 'Food & Bar',
      areaName: 'Food & Bar (Transition Zone)',
      environment: 'transition',
      feltTemperature: 21,
      climateNote: 'High traffic flow between indoor hall and outdoor patio with ambient warmth from catering stations.',
      clothingTip:
        'Hands-free attire! Avoid bulky coats in hand. Wear clothes with deep pockets for keeping your phone, business cards, and napkins accessible.',
      iconName: 'thermometer',
      recommendedItems: ['Hands-free pockets', 'Stain-forgiving tones', 'Flexible layers'],
    },
    {
      areaId: 'Check-in Desk',
      areaName: 'Entrance & Registration Foyer',
      environment: 'transition',
      feltTemperature: Math.round((temperature + 20) / 2),
      climateNote: 'Entryway draft zone as attendees arrive and doors open frequently.',
      clothingTip:
        'Quick-access badge lanyard or wristband. Easily adjustable front zipper or buttoned outer layer.',
      iconName: 'wind',
      recommendedItems: ['Zipped front layer', 'Badge clip area', 'Slip-on footwear'],
    },
  ];

  // Quick picks summary pills
  const quickPicks = [
    isCold ? 'Warm Mid-Layer' : isWarm ? 'Breathable Cotton/Linen' : 'Smart Modular Layers',
    'Indoor AC Cardigan / Blazer',
    isHighRain ? 'Compact Umbrella' : 'Twilight Windbreaker',
    'Walking Sneakers (4,000+ steps)',
  ];

  const overallSummary = isIndoorPlanActive
    ? `All activities shifted to Level 2 Glass Atrium (21°C). Maintain comfortable indoor smart-casual layers with breathable tops.`
    : isHighRain
    ? `Rain alert active (${rainProbability}%). Wear a water-repellent shell or bring a compact umbrella for patio crossing; layer up for brisk 19°C indoor AC.`
    : isCold
    ? `Crisp evening (${temperature}°C). Multi-layer with a warm knit and jacket. Indoor stage AC will feel especially chilly.`
    : isWarm
    ? `Pleasant warm conditions (${temperature}°C). Wear light natural fibers, but keep an overshirt ready for chilly stage AC.`
    : `Optimal twilight temperature (${temperature}°C). Wear flexible layers: breathable base for networking, light jacket for the patio terrace, and a knit for the indoor AC stage.`;

  const comfortIndex = isHighRain
    ? 'Rain-Conscious Modular Layers'
    : isBreezy
    ? 'Wind-Ready Twilight Layers'
    : 'Comfort-Balanced Smart Casual';

  return {
    overallSummary,
    comfortIndex,
    effectiveFeltTemp: feltOutdoorTemp,
    comfortProfile: profile,
    keyCategories: {
      topAndLayers: {
        title: 'Top & Core Layers',
        advice: topAdvice,
        examples: topExamples,
      },
      bottoms: {
        title: 'Bottoms & Trousers',
        advice: bottomsAdvice,
        examples: bottomsExamples,
      },
      footwear: {
        title: 'Footwear & Movement',
        advice: footwearAdvice,
        examples: footwearExamples,
      },
      weatherAccessories: {
        title: 'Weather & Venue Accessories',
        advice: accessoriesAdvice,
        examples: accessoriesExamples,
      },
    },
    areaTips,
    quickPicks,
  };
}
