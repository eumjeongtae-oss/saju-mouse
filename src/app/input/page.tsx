'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFortuneStore } from '@/stores/fortuneStore';
import { Mascot, MascotPose } from '@/components/Mascot';
import { Gender, CalendarType, SajuInput } from '@/types/api';
import * as styles from './page.css';

// 12지 전통 시(時) 이름 헬퍼
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

export default function InputPage() {
  const router = useRouter();
  const { selectedTheme, setSajuInput, reset } = useFortuneStore();

  // 입력 폼 상태 관리 (Zustand SajuInput 타입 규격 준수)
  const [gender, setGender] = useState<Gender>('male');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [year, setYear] = useState<number>(1995); // 기본값 90년대 중반
  const [month, setMonth] = useState<number>(5);
  const [day, setDay] = useState<number>(27);
  const [hour, setHour] = useState<number | null>(12); // 낮 12시 기본
  const [knowsTime, setKnowsTime] = useState<boolean>(true);

  // 1. 선택된 테마가 없을 경우 비정상 접근으로 간주하여 홈으로 튕겨내기
  useEffect(() => {
    if (!selectedTheme) {
      router.replace('/');
    }
  }, [selectedTheme, router]);

  // 2. 해당 연도/월의 마지막 일수 구하기 (윤년/날짜 예외 케이스 완벽 처리)
  const getDaysInMonth = (y: number, m: number): number => {
    return new Date(y, m, 0).getDate();
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);

  // 월이 바뀔 때 현재 설정된 '일'이 최대 일수를 초과하면 최대 일수로 조정
  useEffect(() => {
    if (day > daysInCurrentMonth) {
      setDay(daysInCurrentMonth);
    }
  }, [month, year, day, daysInCurrentMonth]);

  // 3. 셀렉트 박스용 루프 배열 생성
  const years = Array.from({ length: 87 }, (_, i) => 2026 - i); // 1940 ~ 2026
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 ~ 12
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1); // 1 ~ maxDay
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 ~ 23

  // 테마에 맞는 찍쥐 마스코트 포즈 추출
  const getMascotPose = (): MascotPose => {
    switch (selectedTheme) {
      case 'general':
        return 'general';
      case 'yearly':
        return 'yearly';
      case 'wealth':
        return 'wealth';
      case 'love':
        return 'love';
      default:
        return 'idle';
    }
  };

  const handleBack = () => {
    reset();
    router.push('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheme) return;

    const inputData: SajuInput = {
      calendarType,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      birthHour: knowsTime ? hour : null,
      gender,
    };

    setSajuInput(inputData);
    router.push('/result');
  };

  // 비정상 진입 보호
  if (!selectedTheme) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: '16px',
        padding: '8px 0',
      }}
    >
      {/* 상단 테마 쥐 마스코트 (선택된 테마 복장 탑재) */}
      <Mascot pose={getMascotPose()} size={140} />

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 className={styles.pageTitle}>태어난 정보 입력</h2>
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold' }}>
            *{' '}
            {selectedTheme === 'general'
              ? '평생 사주명식'
              : selectedTheme === 'yearly'
              ? '올해 신수비결'
              : selectedTheme === 'wealth'
              ? '대박 재물운'
              : '인연/연애 비책'}
            을 분석해드릴게요
          </span>
        </div>

        {/* 1. 성별 선택 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🙋 성별</label>
          <div className={styles.segmentGroup}>
            <button
              type="button"
              className={`${styles.segmentButton} ${gender === 'male' ? styles.segmentActive : ''}`}
              onClick={() => setGender('male')}
            >
              남자 🙋‍♂️
            </button>
            <button
              type="button"
              className={`${styles.segmentButton} ${gender === 'female' ? styles.segmentActive : ''}`}
              onClick={() => setGender('female')}
            >
              여자 🙋‍♀️
            </button>
          </div>
        </div>

        {/* 2. 달력 선택 (양력/음력) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>📅 양력 / 음력 구분</label>
          <div className={styles.segmentGroup}>
            <button
              type="button"
              className={`${styles.segmentButton} ${calendarType === 'solar' ? styles.segmentActive : ''}`}
              onClick={() => setCalendarType('solar')}
            >
              양력 ☀️
            </button>
            <button
              type="button"
              className={`${styles.segmentButton} ${calendarType === 'lunar' ? styles.segmentActive : ''}`}
              onClick={() => setCalendarType('lunar')}
            >
              음력 🌙
            </button>
          </div>
        </div>

        {/* 3. 생년월일 선택 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🎂 태어난 날짜</label>
          <div className={styles.selectRow}>
            {/* 연도 */}
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>

            {/* 월 */}
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>

            {/* 일 */}
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}일
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          </div>
        </div>

        {/* 4. 태어난 시간 선택 */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className={styles.label}>⏰ 태어난 시간</label>
            {/* 시간 모름 체크박스 */}
            <div
              className={styles.checkboxContainer}
              onClick={() => {
                setKnowsTime(!knowsTime);
                if (knowsTime) setHour(null);
                else setHour(12);
              }}
            >
              <div className={`${styles.checkbox} ${!knowsTime ? styles.checkboxChecked : ''}`}>
                {!knowsTime && '✓'}
              </div>
              태어난 시간을 몰라요 🤷‍♂️
            </div>
          </div>

          {knowsTime && (
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={hour ?? 12}
                onChange={(e) => setHour(Number(e.target.value))}
              >
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

        {/* 분석 버튼 */}
        <button type="submit" className={styles.submitButton}>
          찍쥐야, 내 운세 풀어줘요 🐭 🚀
        </button>

        {/* 뒤로 가기 */}
        <button type="button" className={styles.backButton} onClick={handleBack}>
          ← 처음으로 돌아가기
        </button>
      </form>
    </div>
  );
}
