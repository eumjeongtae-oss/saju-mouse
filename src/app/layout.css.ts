import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const container = style({
  minHeight: '100vh',
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  backgroundColor: '#FAF9FF', // 찍찍사주 전용 부드러운 오프화이트 라벤더톤
  padding: `${vars.space.lg} ${vars.space.md}`,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.02)',
  fontFamily: vars.fonts.body,
  overflowX: 'hidden',
});

export const header = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: vars.space.sm,
  paddingBottom: vars.space.md,
  width: '100%',
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const footer = style({
  textAlign: 'center',
  fontSize: '11px',
  color: '#9CA3AF',
  paddingTop: vars.space.md,
  paddingBottom: vars.space.xs,
  marginTop: 'auto',
  fontWeight: 500,
  width: '100%',
});
