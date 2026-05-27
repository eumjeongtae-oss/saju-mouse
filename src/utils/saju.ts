import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { SajuChart } from '@/types/api';

function splitPillar(hanja: string): { stem: string; branch: string } {
  return { stem: hanja[0], branch: hanja[1] };
}

export function calculateSajuChart(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  birthHour: number | null
): SajuChart {
  const result = calculateSaju(solarYear, solarMonth, solarDay, birthHour ?? undefined);

  return {
    yearPillar: splitPillar(result.yearPillarHanja),
    monthPillar: splitPillar(result.monthPillarHanja),
    dayPillar: splitPillar(result.dayPillarHanja),
    hourPillar: result.hourPillarHanja ? splitPillar(result.hourPillarHanja) : null,
  };
}
