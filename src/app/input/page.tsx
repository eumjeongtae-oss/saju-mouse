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
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTraditionalHourName = (h: number): string => {
    const names = ['자시','축시','인시','묘시','진시','사시','오시','미시','신시','유시','술시','해시'];
    const animals = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
    const idx = h === 23 ? 0 : Math.floor((h + 1) / 2) % 12;
    return `${names[idx]} (${animals[idx]})`;
  };

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
