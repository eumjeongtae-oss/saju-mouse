const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
const STEMS_HAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
const BRANCHES_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export function getGanzhiYear(year: number): string {
  const stemIdx = (year - 4 + 1000) % 10;
  const branchIdx = (year - 4 + 1200) % 12;
  const ko = `${STEMS[stemIdx]}${BRANCHES[branchIdx]}`;
  const han = `${STEMS_HAN[stemIdx]}${BRANCHES_HAN[branchIdx]}`;
  return `${ko}년(${han}年)`;
}

export function padTwo(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatBirthDate(year: number, month: number, day: number): string {
  return `${year}년 ${padTwo(month)}월 ${padTwo(day)}일`;
}

export function formatBirthHour(hour: number | null): string {
  if (hour === null) return '시각 미상';
  return `${padTwo(hour)}시`;
}
