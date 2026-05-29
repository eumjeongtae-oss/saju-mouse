import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const formContainer = style({
  backgroundColor: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.lg,
  padding: '24px 20px',
  width: '100%',
  boxShadow: '6px 6px 0px #1F2937', // 레트로한 쉐도우 효과 일치
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transition: 'all 0.3s ease',
});

export const pageTitle = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: 800,
  color: '#1F2937',
  textAlign: 'center',
  letterSpacing: '-0.02em',
  marginBottom: '4px',
});

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const label = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  color: '#4B5563',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

// 성별 및 양력/음력 세그먼트 버튼 그룹
export const segmentGroup = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  width: '100%',
});

export const segmentButton = style({
  backgroundColor: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px 10px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 700,
  color: '#4B5563',
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '2px 2px 0px #1F2937',

  selectors: {
    '&:hover': {
      backgroundColor: '#F9FAFB',
      transform: 'translateY(-1px)',
      boxShadow: '3px 3px 0px #1F2937',
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

// 활성화된 세그먼트 버튼
export const segmentActive = style({
  backgroundColor: '#EEF2FF', // 메인의 인디고 파스텔톤 매핑
  color: '#7C3AED',
  borderColor: '#7C3AED',
  boxShadow: '3px 3px 0px #7C3AED',
  fontWeight: 800,

  selectors: {
    '&:hover': {
      backgroundColor: '#E0E7FF',
      transform: 'translateY(-1px)',
      boxShadow: '4px 4px 0px #7C3AED',
    },
  },
});

// 생년월일 가로 배치 행
export const selectRow = style({
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr 1fr', // 연도가 조금 더 넓게
  gap: '8px',
  width: '100%',
});

export const selectWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

export const select = style({
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px 28px 12px 12px', // 오른쪽 화살표 여백
  fontSize: vars.fontSizes.sm,
  fontWeight: 700,
  color: '#1F2937',
  cursor: 'pointer',
  appearance: 'none', // 브라우저 기본 화살표 숨김
  outline: 'none',
  transition: 'all 0.2s ease',

  selectors: {
    '&:focus': {
      borderColor: '#7C3AED',
      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
    },
  },
});

// 커스텀 셀렉트 화살표 데코레이터
export const selectArrow = style({
  position: 'absolute',
  right: '12px',
  pointerEvents: 'none',
  fontSize: '10px',
  color: '#1F2937',
  fontWeight: 'bold',
});

// 체크박스 컨테이너 (태어난 시간 모름)
export const checkboxContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: '12px',
  fontWeight: 700,
  color: '#6B7280',
  marginTop: '4px',
  alignSelf: 'flex-end',
});

export const checkbox = style({
  width: '16px',
  height: '16px',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  transition: 'all 0.1s ease',

  selectors: {
    [`${checkboxContainer}:hover &`]: {
      backgroundColor: '#F3F4F6',
    },
  },
});

export const checkboxChecked = style({
  backgroundColor: '#7C3AED',
  borderColor: '#7C3AED',
  color: '#FFFFFF',
});

// 제출하기 대형 보라색 버튼
export const submitButton = style({
  width: '100%',
  backgroundColor: '#7C3AED',
  color: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '14px 16px',
  fontSize: vars.fontSizes.base,
  fontWeight: 800,
  cursor: 'pointer',
  boxShadow: '4px 4px 0px #1F2937',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
  marginTop: '8px',

  selectors: {
    '&:hover': {
      backgroundColor: '#6D28D9',
      transform: 'translate(-2px, -2px)',
      boxShadow: '6px 6px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(2px, 2px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

// 핑크 액센트 활성 세그먼트 (궁합 상대방 패널용)
export const segmentActivePink = style({
  backgroundColor: '#FFF0F6',
  color: '#EC4899',
  borderColor: '#EC4899',
  boxShadow: '3px 3px 0px #EC4899',
  fontWeight: 800,

  selectors: {
    '&:hover': {
      backgroundColor: '#FFE4EE',
      transform: 'translateY(-1px)',
      boxShadow: '4px 4px 0px #EC4899',
    },
  },
});

// 궁합 모드 — 두 패널 나란히 배치
export const compatibilityPanels = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

// VS 구분선
export const compatibilityDivider = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const compatibilityVs = style({
  fontSize: '24px',
  lineHeight: '1',
});

// 궁합 개인 패널 컨테이너
export const personPanel = style({
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderRadius: vars.radii.lg,
  overflow: 'hidden',
  boxShadow: '4px 4px 0px #1F2937',
});

export const personPanelHeader = style({
  padding: '10px 16px',
  borderBottomWidth: '2.5px',
  borderBottomStyle: 'solid',
});

export const personPanelLabel = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: 900,
  letterSpacing: '-0.01em',
});

export const personPanelBody = style({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  backgroundColor: '#FFFFFF',
});

// 뒤로 가기 링크 버튼
export const backButton = style({
  width: '100%',
  backgroundColor: '#FFFFFF',
  color: '#4B5563',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px 16px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '2px 2px 0px #1F2937',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',

  selectors: {
    '&:hover': {
      backgroundColor: '#F9FAFB',
      transform: 'translateY(-1px)',
      boxShadow: '3px 3px 0px #1F2937',
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});
