'use client';

import React, { useEffect } from 'react';
import { Gender, CalendarType } from '@/types/api';
import * as styles from '../page.css';

const getTraditionalHourName = (hour: number): string => {
  if (hour === 23 || hour === 0) return '자시 (子時 - 쥐)';
  if (hour === 1 || hour === 2) return '축시 (丑時 - 소)';
  if (hour === 3 || hour === 4) return '인시 (寅時 - 호랑이)';
  if (hour === 5 || hour === 6) return '묘시 (卯時 - 토끼)';
  if (hour === 7 || hour === 8) return '진시 (辰時 - 용)';
  if (hour === 9 || hour === 10) return '사시 (巳時 - 뱀)';
  if (hour === 11 || hour === 12) return '오시 (午時 - 말)';
  if (hour === 13 || hour === 14) return '미시 (未時 - 양)';
  if (hour === 15 || hour === 16) return '신시 (申時 - 원숭이)';
  if (hour === 17 || hour === 18) return '유시 (酉時 - 닭)';
  if (hour === 19 || hour === 20) return '술시 (戌時 - 개)';
  if (hour === 21 || hour === 22) return '해시 (亥時 - 돼지)';
  return '';
};

export interface PersonState {
  gender: Gender;
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number | null;
  knowsTime: boolean;
}

export const defaultPerson = (gender: Gender = 'male'): PersonState => ({
  gender,
  calendarType: 'solar',
  year: 1995,
  month: 5,
  day: 27,
  hour: 12,
  knowsTime: true,
});

interface PersonInputPanelProps {
  label: string;
  accent: 'purple' | 'pink';
  state: PersonState;
  onChange: (next: PersonState) => void;
}

export function PersonInputPanel({ label, accent, state, onChange }: PersonInputPanelProps) {
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const daysInCurrentMonth = getDaysInMonth(state.year, state.month);

  useEffect(() => {
    if (state.day > daysInCurrentMonth) {
      onChange({ ...state, day: daysInCurrentMonth });
    }
  }, [state.month, state.year]); // eslint-disable-line react-hooks/exhaustive-deps

  const years = Array.from({ length: 87 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const accentColor = accent === 'purple' ? '#7C3AED' : '#EC4899';
  const accentBg = accent === 'purple' ? '#EEF2FF' : '#FFF0F6';
  const accentBgHover = accent === 'purple' ? '#E0E7FF' : '#FFE4EE';
  const accentShadow = accentColor;
  const activeClass = accent === 'purple' ? styles.segmentActive : styles.segmentActivePink;

  const activeStyle = (active: boolean) =>
    active
      ? { backgroundColor: accentBg, color: accentColor, borderColor: accentColor, boxShadow: `3px 3px 0px ${accentShadow}` }
      : {};

  const activeStyleAlt = (active: boolean) =>
    active
      ? { backgroundColor: accentBgHover, color: accentColor, borderColor: accentColor, boxShadow: `3px 3px 0px ${accentShadow}` }
      : {};

  return (
    <div className={styles.personPanel} style={{ borderColor: accentColor }}>
      <div className={styles.personPanelHeader} style={{ backgroundColor: accentBg, borderBottomColor: accentColor }}>
        <span className={styles.personPanelLabel} style={{ color: accentColor }}>{label}</span>
      </div>

      <div className={styles.personPanelBody}>
        {/* 성별 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🙋 성별</label>
          <div className={styles.segmentGroup}>
            <button
              type="button"
              className={`${styles.segmentButton} ${state.gender === 'male' ? activeClass : ''}`}
              style={activeStyle(state.gender === 'male')}
              onClick={() => onChange({ ...state, gender: 'male' })}
            >
              남자 🙋‍♂️
            </button>
            <button
              type="button"
              className={`${styles.segmentButton} ${state.gender === 'female' ? activeClass : ''}`}
              style={activeStyleAlt(state.gender === 'female')}
              onClick={() => onChange({ ...state, gender: 'female' })}
            >
              여자 🙋‍♀️
            </button>
          </div>
        </div>

        {/* 양력/음력 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>📅 양력 / 음력</label>
          <div className={styles.segmentGroup}>
            <button
              type="button"
              className={`${styles.segmentButton} ${state.calendarType === 'solar' ? activeClass : ''}`}
              style={activeStyle(state.calendarType === 'solar')}
              onClick={() => onChange({ ...state, calendarType: 'solar' })}
            >
              양력 ☀️
            </button>
            <button
              type="button"
              className={`${styles.segmentButton} ${state.calendarType === 'lunar' ? activeClass : ''}`}
              style={activeStyleAlt(state.calendarType === 'lunar')}
              onClick={() => onChange({ ...state, calendarType: 'lunar' })}
            >
              음력 🌙
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🎂 태어난 날짜</label>
          <div className={styles.selectRow}>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={state.year} onChange={(e) => onChange({ ...state, year: Number(e.target.value) })}>
                {years.map((y) => <option key={y} value={y}>{y}년</option>)}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={state.month} onChange={(e) => onChange({ ...state, month: Number(e.target.value) })}>
                {months.map((m) => <option key={m} value={m}>{m}월</option>)}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={state.day} onChange={(e) => onChange({ ...state, day: Number(e.target.value) })}>
                {days.map((d) => <option key={d} value={d}>{d}일</option>)}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          </div>
        </div>

        {/* 태어난 시간 */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className={styles.label}>⏰ 태어난 시간</label>
            <div
              className={styles.checkboxContainer}
              onClick={() => onChange({ ...state, knowsTime: !state.knowsTime, hour: state.knowsTime ? null : 12 })}
            >
              <div className={`${styles.checkbox} ${!state.knowsTime ? styles.checkboxChecked : ''}`}>
                {!state.knowsTime && '✓'}
              </div>
              시간 모름 🤷‍♂️
            </div>
          </div>
          {state.knowsTime && (
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={state.hour ?? 12} onChange={(e) => onChange({ ...state, hour: Number(e.target.value) })}>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}시 — {getTraditionalHourName(h)}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
