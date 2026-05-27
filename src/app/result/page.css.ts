import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 쥐가 돋보기로 사주 공부하는 로딩용 씰룩씰룩 애니메이션
const wiggle = keyframes({
  '0%, 100%': { transform: 'rotate(-5deg) translateY(0)' },
  '50%': { transform: 'rotate(5deg) translateY(-4px)' },
});

// 회전하는 땀방울 (로딩 극대화)
const sweatDrop = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-5px) scale(0.5)' },
  '50%': { opacity: 1 },
  '100%': { opacity: 0, transform: 'translateY(8px) scale(0.8)' },
});

export const loadingContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: '20px',
  width: '100%',
  padding: '40px 20px',
  textAlign: 'center',
});

export const loadingMascotWrapper = style({
  position: 'relative',
  animation: `${wiggle} 1.5s ease-in-out infinite`,
});

// 땀방울 데코
export const sweat = style({
  position: 'absolute',
  top: '30px',
  right: '25px',
  fontSize: '20px',
  animation: `${sweatDrop} 1.2s ease-in-out infinite`,
});

export const loadingText = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  color: '#4B5563',
  lineHeight: '1.6',
});

// 결과 본문 메인 컨테이너
export const resultContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  paddingBottom: '24px',
});

// 레트로 사주팔자 4주 카드 박스
export const pillarsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px',
  width: '100%',
});

export const pillarCard = style({
  backgroundColor: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px 6px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '2px 2px 0px #1F2937',
  textAlign: 'center',
});

export const pillarLabel = style({
  fontSize: '10px',
  fontWeight: 800,
  color: '#9CA3AF',
  textTransform: 'uppercase',
});

export const kanjiBlock = style({
  fontSize: '18px',
  fontWeight: 900,
  color: '#1F2937',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const kanjiCheon = style({
  color: '#7C3AED', // 천간은 보라색 강조
});

export const kanjiJi = style({
  color: '#10B981', // 지지는 초록색 강조
});

export const pillarKo = style({
  fontSize: '11px',
  color: '#6B7280',
  fontWeight: 700,
});

// 1. 대형 결과 요약 말풍선
export const summaryBubble = style({
  backgroundColor: '#EEF2FF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.lg,
  padding: '20px',
  fontSize: vars.fontSizes.base,
  fontWeight: 800,
  color: '#1F2937',
  lineHeight: '1.5',
  boxShadow: '4px 4px 0px #1F2937',
  textAlign: 'center',
  position: 'relative',
});

// 2. 상세 풀이 텍스트 박스
export const detailBox = style({
  backgroundColor: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.lg,
  padding: '24px 20px',
  boxShadow: '4px 4px 0px #1F2937',
  lineHeight: '1.7',
  fontSize: vars.fontSizes.sm,
  color: '#374151',
  whiteSpace: 'pre-wrap', // 개행 문자 보존
});

export const detailTitle = style({
  fontSize: vars.fontSizes.base,
  fontWeight: 900,
  color: '#1F2937',
  marginBottom: '12px',
  borderBottom: '2.5px dashed #E5E7EB',
  paddingBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

// 단락 래퍼 (sections가 있을 경우)
export const sectionsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const sectionBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const sectionTitle = style({
  fontSize: '15px',
  fontWeight: 800,
  color: '#4B5563',
  marginBottom: '4px',
});

export const sectionContent = style({
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
  lineHeight: '1.7',
  whiteSpace: 'pre-wrap',
});

// 3. 찍쥐의 행운 처방전 (Lucky Items)
export const luckyContainer = style({
  backgroundColor: '#FFFBEB', // 옐로우 파스텔
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.lg,
  padding: '16px 20px',
  boxShadow: '4px 4px 0px #1F2937',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const luckyRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
});

export const luckyItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const luckyLabel = style({
  fontSize: '11px',
  fontWeight: 800,
  color: '#D97706',
});

export const luckyValue = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  color: '#1F2937',
});

// 4. 구글 배너 광고 영역 (AdSense Wrapper)
export const adBanner = style({
  backgroundColor: '#F3F4F6',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '16px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100px',
  position: 'relative',
  boxShadow: '2px 2px 0px #1F2937',
  margin: '10px 0',
  overflow: 'hidden',
});

export const adLabel = style({
  position: 'absolute',
  top: '0',
  left: '0',
  backgroundColor: '#1F2937',
  color: '#FFFFFF',
  fontSize: '9px',
  fontWeight: 'bold',
  padding: '2px 6px',
  borderBottomRightRadius: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const adText = style({
  fontSize: '12px',
  color: '#6B7280',
  fontWeight: 700,
  marginTop: '4px',
});

// 5. 공유하기 레이블 및 버튼들
export const shareSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  marginTop: '10px',
});

export const shareTitle = style({
  fontSize: '12px',
  fontWeight: 800,
  color: '#4B5563',
  textAlign: 'center',
});

export const shareButtonGroup = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  width: '100%',
});

export const shareKakao = style({
  backgroundColor: '#FEE500', // 카카오 노란색
  color: '#191919',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '3px 3px 0px #1F2937',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',

  selectors: {
    '&:hover': {
      backgroundColor: '#F3DA00',
      transform: 'translate(-2px, -2px)',
      boxShadow: '5px 5px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(1px, 1px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

export const shareLink = style({
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '3px 3px 0px #1F2937',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',

  selectors: {
    '&:hover': {
      backgroundColor: '#F9FAFB',
      transform: 'translate(-2px, -2px)',
      boxShadow: '5px 5px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(1px, 1px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

// 다시하기 버튼
export const restartButton = style({
  width: '100%',
  backgroundColor: '#1F2937',
  color: '#FFFFFF',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '14px 16px',
  fontSize: vars.fontSizes.base,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '4px 4px 0px #1F2937',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
  marginTop: '10px',

  selectors: {
    '&:hover': {
      backgroundColor: '#374151',
      transform: 'translate(-2px, -2px)',
      boxShadow: '6px 6px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(2px, 2px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
  },
});

// ─── 키워드 칩 ────────────────────────────────────────────────────────────────

export const keywordsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
});

export const keywordChip = style({
  backgroundColor: '#7C3AED',
  color: '#FFFFFF',
  borderRadius: '20px',
  padding: '5px 14px',
  fontSize: '12px',
  fontWeight: 800,
  border: '2px solid #1F2937',
  boxShadow: '2px 2px 0px #1F2937',
});

// ─── Extras 섹션 ──────────────────────────────────────────────────────────────

export const extrasContainer = style({
  backgroundColor: '#F0FDF4',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.lg,
  padding: '20px',
  boxShadow: '4px 4px 0px #1F2937',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const extrasTitle = style({
  fontSize: vars.fontSizes.base,
  fontWeight: 900,
  color: '#1F2937',
  borderBottom: '2.5px dashed #E5E7EB',
  paddingBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  margin: '0',
});

export const extrasInfoLabel = style({
  fontSize: '11px',
  fontWeight: 800,
  color: '#6B7280',
  marginBottom: '4px',
});

export const extrasInfoValue = style({
  fontSize: '13px',
  fontWeight: 700,
  color: '#1F2937',
  lineHeight: '1.5',
});

// 직업 카드 그리드 (general 테마)
export const careerCardsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
});

export const careerCard = style({
  backgroundColor: '#FFFFFF',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '10px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '2px 2px 0px #1F2937',
  textAlign: 'center',
});

export const careerCardName = style({
  fontSize: '12px',
  fontWeight: 900,
  color: '#7C3AED',
});

export const careerCardReason = style({
  fontSize: '10px',
  fontWeight: 500,
  color: '#6B7280',
  lineHeight: '1.4',
});

// 월별 하이라이트 (yearly 테마)
export const monthHighlightRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
});

export const monthHighlightBest = style({
  backgroundColor: '#DCFCE7',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px',
  textAlign: 'center',
  boxShadow: '2px 2px 0px #1F2937',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const monthHighlightWorst = style({
  backgroundColor: '#FEE2E2',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px',
  textAlign: 'center',
  boxShadow: '2px 2px 0px #1F2937',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const monthHighlightLabel = style({
  fontSize: '11px',
  fontWeight: 800,
  color: '#6B7280',
});

export const monthHighlightValue = style({
  fontSize: '22px',
  fontWeight: 900,
  color: '#1F2937',
});

// 재물 분야 뱃지 (wealth 테마)
export const wealthFieldsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
});

export const wealthFieldBadge = style({
  backgroundColor: '#FEF3C7',
  border: '1.5px solid #1F2937',
  borderRadius: '16px',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: 800,
  color: '#92400E',
});

// 궁합/피해야 할 타입 (general, love 테마)
export const traitsRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
});

export const traitsBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const traitsBlockTitle = style({
  fontSize: '12px',
  fontWeight: 800,
  color: '#374151',
});

export const traitItem = style({
  fontSize: '12px',
  fontWeight: 600,
  color: '#1F2937',
  backgroundColor: '#FFFFFF',
  border: '1.5px solid #E5E7EB',
  borderRadius: '8px',
  padding: '5px 8px',
  lineHeight: '1.4',
});

export const captureButton = style({
  width: '100%',
  backgroundColor: '#EEF2FF',
  color: '#4C1D95',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: '#1F2937',
  borderRadius: vars.radii.md,
  padding: '12px',
  fontSize: vars.fontSizes.sm,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '3px 3px 0px #1F2937',
  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',

  selectors: {
    '&:hover': {
      backgroundColor: '#E0E7FF',
      transform: 'translate(-2px, -2px)',
      boxShadow: '5px 5px 0px #1F2937',
    },
    '&:active': {
      transform: 'translate(1px, 1px)',
      boxShadow: '1px 1px 0px #1F2937',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
});

// ─── 하찮은 클립보드 복사 성공 토스트 팝업
const slideUp = keyframes({
  from: { transform: 'translateY(100px)', opacity: 0 },
  to: { transform: 'translateY(0)', opacity: 1 },
});

export const toast = style({
  position: 'fixed',
  bottom: '40px',
  left: 'calc(50% - 110px)', // 중앙 배치 (너비 220px 기준)
  width: '220px',
  backgroundColor: '#1F2937',
  color: '#FFFFFF',
  border: '2px solid #FFFFFF',
  borderRadius: '30px',
  padding: '10px 16px',
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  zIndex: 9999,
  animation: `${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
});
