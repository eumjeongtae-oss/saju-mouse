import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { flexCenter } from '@/styles/common.css';

// 둥둥 떠다니는 애니메이션 (말풍선용)
const floatBubble = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-3px)' },
});

// 페이드인 애니메이션 (카드 로딩용)
const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(15px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});


export const mainSection = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.lg,
  margin: `${vars.space.md} 0`,
});

// 찍쥐 쇼케이스 (말풍선 + 마스코트)
export const showcase = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  position: 'relative',
});

// 하찮고 귀여운 말풍선
export const speechBubble = style({
  backgroundColor: vars.colors.background,
  border: `2px stroke ${vars.colors.border}`,
  borderRadius: vars.radii.lg,
  padding: '12px 20px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 600,
  color: vars.colors.text,
  textAlign: 'center',
  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.06)',
  position: 'relative',
  animation: `${floatBubble} 4s ease-in-out infinite`,
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937', // 하찮은 드로잉 느낌의 강한 보더 선
  maxWidth: '85%',
  minWidth: '200px',
  lineHeight: '1.4',
  transition: 'all 0.2s ease',

  selectors: {
    // 말풍선 아래쪽 꼬리
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderWidth: '10px 10px 0',
      borderStyle: 'solid',
      borderColor: '#1F2937 transparent transparent',
      display: 'block',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderWidth: '8px 8px 0',
      borderStyle: 'solid',
      borderColor: `${vars.colors.background} transparent transparent`,
      zIndex: 1,
      display: 'block',
    },
  },
});

export const speechBubbleHighlight = style({
  color: vars.colors.primary,
  fontWeight: 800,
});

// 카드 그리드 컨테이너
export const grid = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr', // 2열 배치
  gap: '12px',
  marginTop: vars.space.sm,
  animation: `${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
});

// 운세 카드 공통 스타일
export const card = style({
  backgroundColor: vars.colors.background,
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937', // 하찮은 드로잉 보더
  borderRadius: vars.radii.lg,
  padding: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  minHeight: '150px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '4px 4px 0px #1F2937', // 레트로한 쉐도우 (하찮은 느낌 강조)
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',

  selectors: {
    '&:hover': {
      transform: 'translate(-2px, -2px)',
      boxShadow: '6px 6px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(2px, 2px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

// 카드별 개별 테마 스타일 (파스텔 배경)
export const cardGeneral = style({
  backgroundColor: '#EEF2FF', // 인디고 파스텔
  selectors: {
    '&:hover': {
      backgroundColor: '#E0E7FF',
    },
  },
});

export const cardYearly = style({
  backgroundColor: '#FEF2F2', // 레드 파스텔
  selectors: {
    '&:hover': {
      backgroundColor: '#FEE2E2',
    },
  },
});

export const cardWealth = style({
  backgroundColor: '#FFFBEB', // 옐로우 파스텔
  selectors: {
    '&:hover': {
      backgroundColor: '#FEF3C7',
    },
  },
});

export const cardLove = style({
  backgroundColor: '#FDF2F8', // 핑크 파스텔
  selectors: {
    '&:hover': {
      backgroundColor: '#FCE7F3',
    },
  },
});

export const cardCompatibility = style({
  backgroundColor: '#FFF0F6', // 딥 핑크 파스텔
  selectors: {
    '&:hover': {
      backgroundColor: '#FFE4EE',
    },
  },
});


// 궁합 카드 전체 너비 레이아웃
export const cardCompatibilityFull = style({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: '80px',
  gap: '16px',
});

// 궁합 카드 우측 뱃지
export const cardCompatibilityBadge = style({
  marginLeft: 'auto',
  backgroundColor: '#EC4899',
  color: '#FFFFFF',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '11px',
  fontWeight: 800,
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

// 카드 내의 내용 스타일들
export const cardIcon = style({
  fontSize: '28px',
  lineHeight: '1',
  transition: 'transform 0.3s ease',
  selectors: {
    [`${card}:hover &`]: {
      transform: 'scale(1.2) rotate(8deg)',
    },
  },
});

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%',
});

export const cardTitle = style({
  fontSize: vars.fontSizes.base,
  fontWeight: 800,
  color: '#1F2937',
  letterSpacing: '-0.02em',
});

export const cardDesc = style({
  fontSize: '11px',
  color: '#6B7280',
  lineHeight: '1.4',
  fontWeight: 500,
});

// 화살표 꼬리 아이콘
export const cardArrow = style({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  width: '24px',
  height: '24px',
  borderRadius: vars.radii.full,
  backgroundColor: '#1F2937',
  color: vars.colors.background,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 'bold',
  transition: 'transform 0.2s ease',

  selectors: {
    [`${card}:hover &`]: {
      transform: 'translateX(3px)',
    },
  },
});


