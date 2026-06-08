'use client';

import { Mascot } from '@/components/Mascot';
import { Gender, CalendarType } from '@/types/api';
import { PersonInputPanel } from './_components/PersonInputPanel';
import { useInputForm } from './_hooks/useInputForm';
import * as styles from './page.css';

export default function InputPage() {
  const {
    selectedTheme,
    isCompatibility,
    gender, setGender,
    calendarType, setCalendarType,
    year, setYear,
    month, setMonth,
    day, setDay,
    hour, setHour,
    knowsTime, setKnowsTime,
    daysInCurrentMonth,
    myInfo, setMyInfo,
    partnerInfo, setPartnerInfo,
    getMascotPose,
    getThemeLabel,
    handleBack,
    handleSubmit,
  } = useInputForm();

  if (!selectedTheme) return null;

  const years = Array.from({ length: 87 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

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

  // ── 궁합 모드 ──────────────────────────────────────────────────
  if (isCompatibility) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', padding: '8px 0' }}>
        <Mascot pose="compatibility" size={130} />

        <form className={styles.formContainer} onSubmit={handleSubmit} style={{ gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            <h2 className={styles.pageTitle}>연인 궁합 정보 입력</h2>
            <span style={{ fontSize: '11px', color: '#EC4899', fontWeight: 'bold' }}>
              * {getThemeLabel()}을 분석해드릴게요
            </span>
          </div>

          <div className={styles.compatibilityPanels}>
            <PersonInputPanel label="💜 나의 사주" accent="purple" state={myInfo} onChange={setMyInfo} />
            <div className={styles.compatibilityDivider}>
              <span className={styles.compatibilityVs}>💑</span>
            </div>
            <PersonInputPanel label="💗 상대방 사주" accent="pink" state={partnerInfo} onChange={setPartnerInfo} />
          </div>

          <button type="submit" className={styles.submitButton} style={{ backgroundColor: '#EC4899' }}>
            찍쥐야, 우리 궁합 알아봐줘 💑 🚀
          </button>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            ← 처음으로 돌아가기
          </button>
        </form>

      </div>
    );
  }

  // ── 일반 모드 ──────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '16px', padding: '8px 0' }}>
      <Mascot pose={getMascotPose()} size={140} />

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 className={styles.pageTitle}>태어난 정보 입력</h2>
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold' }}>
            * {getThemeLabel()}을 분석해드릴게요
          </span>
        </div>

        {/* 성별 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🙋 성별</label>
          <div className={styles.segmentGroup}>
            <button type="button" className={`${styles.segmentButton} ${gender === 'male' ? styles.segmentActive : ''}`} onClick={() => setGender('male' as Gender)}>
              남자 🙋‍♂️
            </button>
            <button type="button" className={`${styles.segmentButton} ${gender === 'female' ? styles.segmentActive : ''}`} onClick={() => setGender('female' as Gender)}>
              여자 🙋‍♀️
            </button>
          </div>
        </div>

        {/* 양력/음력 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>📅 양력 / 음력 구분</label>
          <div className={styles.segmentGroup}>
            <button type="button" className={`${styles.segmentButton} ${calendarType === 'solar' ? styles.segmentActive : ''}`} onClick={() => setCalendarType('solar' as CalendarType)}>
              양력 ☀️
            </button>
            <button type="button" className={`${styles.segmentButton} ${calendarType === 'lunar' ? styles.segmentActive : ''}`} onClick={() => setCalendarType('lunar' as CalendarType)}>
              음력 🌙
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>🎂 태어난 날짜</label>
          <div className={styles.selectRow}>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => <option key={y} value={y}>{y}년</option>)}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {months.map((m) => <option key={m} value={m}>{m}월</option>)}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={day} onChange={(e) => setDay(Number(e.target.value))}>
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
              onClick={() => { setKnowsTime(!knowsTime); setHour(knowsTime ? null : 12); }}
            >
              <div className={`${styles.checkbox} ${!knowsTime ? styles.checkboxChecked : ''}`}>
                {!knowsTime && '✓'}
              </div>
              태어난 시간을 몰라요 🤷‍♂️
            </div>
          </div>
          {knowsTime && (
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={hour ?? 12} onChange={(e) => setHour(Number(e.target.value))}>
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

        <button type="submit" className={styles.submitButton}>
          찍쥐야, 내 운세 풀어줘요 🐭 🚀
        </button>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          ← 처음으로 돌아가기
        </button>
      </form>

    </div>
  );
}
