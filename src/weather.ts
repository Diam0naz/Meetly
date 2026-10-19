/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Open-Meteo Weather Service
 * Free open API without API keys required.
 */

import { WeatherData } from './types';

export function getWeatherConditionDescription(code: number): {
  label: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-snow';
} {
  switch (code) {
    case 0:
      return { label: 'Clear Skies', icon: 'sun' };
    case 1:
      return { label: 'Mostly Clear', icon: 'cloud-sun' };
    case 2:
      return { label: 'Partly Cloudy', icon: 'cloud-sun' };
    case 3:
      return { label: 'Overcast', icon: 'cloud' };
    case 45:
    case 48:
      return { label: 'Foggy & Misty', icon: 'cloud' };
    case 51:
    case 53:
    case 55:
      return { label: 'Light Drizzle', icon: 'cloud-rain' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rainy Showers', icon: 'cloud-rain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow Flurries', icon: 'cloud-snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Heavy Rain Showers', icon: 'cloud-rain' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorms', icon: 'cloud-lightning' };
    default:
      return { label: 'Pleasant Breeze', icon: 'cloud-sun' };
  }
}

/**
 * Fallback weather dataset when offline or if Open-Meteo network request fails
 */
export const DEFAULT_FALLBACK_WEATHER: WeatherData = {
  temperature: 21,
  weatherCode: 2,
  weatherDescription: 'Partly Cloudy with Golden Hour Sunset',
  rainProbability: 15,
  windSpeed: 12,
  isDay: true,
  highRainAlert: false,
  isFallback: true,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

/**
 * Fetches real weather data from Open-Meteo API
 */
export async function fetchEventWeather(
  lat: number,
  lon: number,
  forceHighRainSim: boolean = false
): Promise<WeatherData> {
  // If demo mode forced rain simulation to test the >60% rain trigger
  if (forceHighRainSim) {
    return {
      temperature: 16,
      weatherCode: 63,
      weatherDescription: 'Heavy Incoming Rainband (Demo Alert Active)',
      rainProbability: 78,
      windSpeed: 24,
      isDay: false,
      highRainAlert: true,
      isFallback: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=precipitation_probability,temperature_2m&timezone=auto`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const hourly = data.hourly;

    const temp = Math.round(current?.temperature_2m ?? 20);
    const code = current?.weather_code ?? 1;
    const wind = Math.round(current?.wind_speed_10m ?? 10);

    // Calculate max rain probability over the next few hours
    let maxRainProb = 15;
    if (hourly?.precipitation_probability && Array.isArray(hourly.precipitation_probability)) {
      const nextFewHours = hourly.precipitation_probability.slice(0, 6);
      maxRainProb = Math.max(...nextFewHours, 10);
    }

    const condition = getWeatherConditionDescription(code);

    return {
      temperature: temp,
      weatherCode: code,
      weatherDescription: condition.label,
      rainProbability: maxRainProb,
      windSpeed: wind,
      isDay: true,
      highRainAlert: maxRainProb > 60,
      isFallback: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error) {
    console.warn('Weather fetch encountered an issue, using graceful fallback:', error);
    return {
      ...DEFAULT_FALLBACK_WEATHER,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
