'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFortuneStore } from '@/stores/fortuneStore';
import { Gender, CalendarType, SajuInput } from '@/types/api';
import { MascotPose } from '@/components/Mascot';
import { PersonState, defaultPerson } from '../_components/PersonInputPanel';

export function useInputForm() {
  const router = useRouter();
  const { selectedTheme, setSajuInput, setPartnerInput, reset } = useFortuneStore();

  const isCompatibility = selectedTheme === 'compatibility';

  // 일반 모드 상태
  const [gender, setGender] = useState<Gender>('male');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [year, setYear] = useState(1995);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(27);
  const [hour, setHour] = useState<number | null>(12);
  const [knowsTime, setKnowsTime] = useState(true);
  const [isTwin, setIsTwin] = useState(false);
  const [twinType, setTwinType] = useState<'older' | 'younger'>('older');

  // 궁합 모드 상태
  const [myInfo, setMyInfo] = useState<PersonState>(defaultPerson('male'));
  const [partnerInfo, setPartnerInfo] = useState<PersonState>(defaultPerson('female'));

  useEffect(() => {
    if (!selectedTheme) router.replace('/');
  }, [selectedTheme, router]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const daysInCurrentMonth = getDaysInMonth(year, month);

  useEffect(() => {
    if (day > daysInCurrentMonth) setDay(daysInCurrentMonth);
  }, [month, year, day, daysInCurrentMonth]);

  const getMascotPose = (): MascotPose => {
    switch (selectedTheme) {
      case 'general': return 'general';
      case 'yearly': return 'yearly';
      case 'wealth': return 'wealth';
      case 'love': return 'love';
      case 'compatibility': return 'compatibility';
      default: return 'idle';
    }
  };

  const getThemeLabel = (): string => {
    switch (selectedTheme) {
      case 'general': return '평생 사주명식';
      case 'yearly': return '올해 신수비결';
      case 'wealth': return '대박 재물운';
      case 'love': return '인연/연애 비책';
      case 'compatibility': return '두 사람의 사주 궁합';
      default: return '';
    }
  };

  const handleBack = () => {
    reset();
    router.push('/');
  };

  const toSajuInput = (p: PersonState): SajuInput => ({
    calendarType: p.calendarType,
    birthYear: p.year,
    birthMonth: p.month,
    birthDay: p.day,
    birthHour: p.knowsTime ? p.hour : null,
    gender: p.gender,
    isTwin: p.isTwin,
    twinType: p.twinType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheme) return;

    if (isCompatibility) {
      setSajuInput(toSajuInput(myInfo));
      setPartnerInput(toSajuInput(partnerInfo));
    } else {
      setSajuInput({ calendarType, birthYear: year, birthMonth: month, birthDay: day, birthHour: knowsTime ? hour : null, gender, isTwin, twinType });
    }
    router.push('/result');
  };

  return {
    selectedTheme,
    isCompatibility,
    // 일반 모드
    gender, setGender,
    calendarType, setCalendarType,
    year, setYear,
    month, setMonth,
    day, setDay,
    hour, setHour,
    knowsTime, setKnowsTime,
    isTwin, setIsTwin,
    twinType, setTwinType,
    daysInCurrentMonth,
    // 궁합 모드
    myInfo, setMyInfo,
    partnerInfo, setPartnerInfo,
    // 공통
    getMascotPose,
    getThemeLabel,
    handleBack,
    handleSubmit,
  };
}
