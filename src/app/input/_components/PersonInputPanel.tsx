'use client';

import React, { useEffect } from 'react';
import { Gender, CalendarType } from '@/types/api';
import * as styles from '../page.css';

const TIME_RANGES = [
  { value: 0, label: '23:30 ~ 01:30 (자시 - 쥐)' },
  { value: 2, label: '01:30 ~ 03:30 (축시 - 소)' },
  { value: 4, label: '03:30 ~ 05:30 (인시 - 호랑이)' },
  { value: 6, label: '05:30 ~ 07:30 (묘시 - 토끼)' },
  { value: 8, label: '07:30 ~ 09:30 (진시 - 용)' },
  { value: 10, label: '09:30 ~ 11:30 (사시 - 뱀)' },
  { value: 12, label: '11:30 ~ 13:30 (오시 - 말)' },
  { value: 14, label: '13:30 ~ 15:30 (미시 - 양)' },
  { value: 16, label: '15:30 ~ 17:30 (신시 - 원숭이)' },
  { value: 18, label: '17:30 ~ 19:30 (유시 - 닭)' },
  { value: 20, label: '19:30 ~ 21:30 (술시 - 개)' },
  { value: 22, label: '21:30 ~ 23:30 (해시 - 돼지)' },
];

export interface PersonState {
  gender: Gender;
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number | null;
  knowsTime: boolean;
  isTwin?: boolean;
  twinType?: 'older' | 'younger';
}

export const defaultPerson = (gender: Gender = 'male'): PersonState => ({
  gender,
  calendarType: 'solar',
  year: 1995,
  month: 5,
  day: 27,
  hour: 12,
  knowsTime: true,
  isTwin: false,
  twinType: 'older',
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
                {TIME_RANGES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          )}
        </div>

        {/* 쌍둥이 여부 */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className={styles.label}>👯 쌍둥이이신가요?</label>
            <div
              className={styles.checkboxContainer}
              onClick={() => onChange({ ...state, isTwin: !state.isTwin })}
            >
              <div className={`${styles.checkbox} ${state.isTwin ? styles.checkboxChecked : ''}`}>
                {state.isTwin && '✓'}
              </div>
              네, 쌍둥이입니다
            </div>
          </div>
          {state.isTwin && (
            <div className={styles.segmentGroup} style={{ marginTop: '8px' }}>
              <button
                type="button"
                className={`${styles.segmentButton} ${state.twinType === 'older' ? activeClass : ''}`}
                style={activeStyle(state.twinType === 'older')}
                onClick={() => onChange({ ...state, twinType: 'older' })}
              >
                첫째 ☝️
              </button>
              <button
                type="button"
                className={`${styles.segmentButton} ${state.twinType === 'younger' ? activeClass : ''}`}
                style={activeStyleAlt(state.twinType === 'younger')}
                onClick={() => onChange({ ...state, twinType: 'younger' })}
              >
                둘째 ✌️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
