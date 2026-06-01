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

const HEAVEN_ELEMENTS: Record<string, string> = {
  '甲': '木 (양)', '乙': '木 (음)', '丙': '火 (양)', '丁': '火 (음)',
  '戊': '土 (양)', '己': '土 (음)', '庚': '金 (양)', '辛': '金 (음)',
  '壬': '水 (양)', '癸': '水 (음)'
};

const EARTH_ELEMENTS: Record<string, string> = {
  '子': '水 (음)', '丑': '土 (음)', '寅': '木 (양)', '卯': '木 (음)',
  '辰': '土 (양)', '巳': '火 (양)', '午': '火 (음)', '未': '土 (음)',
  '申': '金 (양)', '酉': '金 (음)', '戌': '土 (양)', '亥': '水 (양)'
};

// 십성 표 (일간 기준)
const TEN_GODS: Record<string, Record<string, Record<string, string>>> = {
  '木': { '木': {'same': '비견', 'diff': '겁재'}, '火': {'same': '식신', 'diff': '상관'}, '土': {'same': '편재', 'diff': '정재'}, '金': {'same': '편관', 'diff': '정관'}, '水': {'same': '편인', 'diff': '정인'} },
  '火': { '火': {'same': '비견', 'diff': '겁재'}, '土': {'same': '식신', 'diff': '상관'}, '金': {'same': '편재', 'diff': '정재'}, '水': {'same': '편관', 'diff': '정관'}, '木': {'same': '편인', 'diff': '정인'} },
  '土': { '土': {'same': '비견', 'diff': '겁재'}, '金': {'same': '식신', 'diff': '상관'}, '水': {'same': '편재', 'diff': '정재'}, '木': {'same': '편관', 'diff': '정관'}, '火': {'same': '편인', 'diff': '정인'} },
  '金': { '金': {'same': '비견', 'diff': '겁재'}, '水': {'same': '식신', 'diff': '상관'}, '木': {'same': '편재', 'diff': '정재'}, '火': {'same': '편관', 'diff': '정관'}, '土': {'same': '편인', 'diff': '정인'} },
  '水': { '水': {'same': '비견', 'diff': '겁재'}, '木': {'same': '식신', 'diff': '상관'}, '火': {'same': '편재', 'diff': '정재'}, '土': {'same': '편관', 'diff': '정관'}, '金': {'same': '편인', 'diff': '정인'} }
};

export function getTenGod(dayStemHanja: string, targetHanja: string, isBranch = false): string {
  const dayElStr = HEAVEN_ELEMENTS[dayStemHanja];
  if (!dayElStr) return '';
  const dayEl = dayElStr[0];
  const dayYinYang = dayElStr.includes('양') ? '양' : '음';

  const targetElStr = isBranch ? EARTH_ELEMENTS[targetHanja] : HEAVEN_ELEMENTS[targetHanja];
  if (!targetElStr) return '';
  const targetEl = targetElStr[0];
  const targetYinYang = targetElStr.includes('양') ? '양' : '음';

  const relation = dayYinYang === targetYinYang ? 'same' : 'diff';
  return TEN_GODS[dayEl]?.[targetEl]?.[relation] || '';
}

export function analyzeSajuElements(chart: SajuChart) {
  const dayStem = chart.dayPillar.stem;
  
  const pillars = [
    { name: '년주', stem: chart.yearPillar.stem, branch: chart.yearPillar.branch },
    { name: '월주', stem: chart.monthPillar.stem, branch: chart.monthPillar.branch },
    { name: '일주', stem: chart.dayPillar.stem, branch: chart.dayPillar.branch },
  ];
  if (chart.hourPillar) {
    pillars.push({ name: '시주', stem: chart.hourPillar.stem, branch: chart.hourPillar.branch });
  }

  const elementsCount: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const details = pillars.map(p => {
    const sEl = HEAVEN_ELEMENTS[p.stem];
    const bEl = EARTH_ELEMENTS[p.branch];
    if (sEl) elementsCount[sEl[0]]++;
    if (bEl) elementsCount[bEl[0]]++;

    return {
      name: p.name,
      stem: p.stem,
      stemElement: sEl,
      stemTenGod: p.name === '일주' ? '일간(나)' : getTenGod(dayStem, p.stem, false),
      branch: p.branch,
      branchElement: bEl,
      branchTenGod: getTenGod(dayStem, p.branch, true),
    };
  });

  return { elementsCount, details };
}

export function getCurrentWoon(): { sewun: string; wolwun: string } {
  const now = new Date();
  const res = calculateSaju(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
  return {
    sewun: res.yearPillarHanja,
    wolwun: res.monthPillarHanja
  };
}

export function calculateDaewun(
  birthYear: number, 
  gender: 'male' | 'female', 
  yearPillarStem: string,
  monthPillarHanja: string
): string {
  const isYangYear = HEAVEN_ELEMENTS[yearPillarStem]?.includes('양');
  const isForward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);
  
  const now = new Date();
  const age = now.getFullYear() - birthYear + 1; 
  
  const daewunStep = Math.floor(age / 10) + 1; 
  
  let stemIndex = HEAVEN.indexOf(monthPillarHanja[0]);
  let branchIndex = EARTH.indexOf(monthPillarHanja[1]);
  
  if (stemIndex === -1 || branchIndex === -1) return '';

  const step = isForward ? daewunStep : -daewunStep;
  
  const currentDaewunStem = HEAVEN[(stemIndex + step + 120) % 10];
  const currentDaewunBranch = EARTH[(branchIndex + step + 120) % 12];
  
  return currentDaewunStem + currentDaewunBranch;
}

