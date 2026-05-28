import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { SajuChart } from '@/types/api';

function splitPillar(hanja: string): { stem: string; branch: string } {
  return { stem: hanja[0], branch: hanja[1] };
}

const HEAVEN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTH = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function getFallbackSajuChart(
  year: number,
  month: number,
  day: number,
  hour: number | null
): SajuChart {
  const yH = ((year - 4) % 10 + 10) % 10;
  const yE = ((year - 4) % 12 + 12) % 12;
  const mH = (month + 2) % 10;
  const mE = (month + 10) % 12;
  const dH = (day + 7) % 10;
  const dE = (day + 4) % 12;
  const hH = hour !== null ? (hour + 1) % 10 : 4;
  const hE = hour !== null ? Math.floor((hour + 1) / 2) % 12 : 0;

  return {
    yearPillar: { stem: HEAVEN[yH], branch: EARTH[yE] },
    monthPillar: { stem: HEAVEN[mH], branch: EARTH[mE] },
    dayPillar: { stem: HEAVEN[dH], branch: EARTH[dE] },
    hourPillar: hour !== null ? { stem: HEAVEN[hH], branch: EARTH[hE] } : null,
  };
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
