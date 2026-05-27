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
  paddingTop: vars.space.md,
  paddingBottom: vars.space.xs,
  marginTop: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
});

export const footerCopyright = style({
  fontSize: '11px',
  color: '#9CA3AF',
  fontWeight: 500,
  margin: 0,
});

export const footerLinks = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const footerLink = style({
  fontSize: '11px',
  color: '#9CA3AF',
  textDecoration: 'none',
  ':hover': {
    color: '#6B7280',
    textDecoration: 'underline',
  },
});

export const footerDivider = style({
  fontSize: '11px',
  color: '#D1D5DB',
});
