import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const container = style({
  padding: `${vars.space.lg} 0`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const title = style({
  fontSize: '22px',
  fontWeight: 700,
  color: vars.colors.text,
  margin: 0,
});

export const updated = style({
  fontSize: '12px',
  color: vars.colors.textMuted,
  margin: 0,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const sectionTitle = style({
  fontSize: '15px',
  fontWeight: 600,
  color: vars.colors.text,
  margin: 0,
});

export const text = style({
  fontSize: '13px',
  color: vars.colors.textMuted,
  lineHeight: 1.7,
  margin: 0,
});

export const list = style({
  fontSize: '13px',
  color: vars.colors.textMuted,
  lineHeight: 1.7,
  paddingLeft: '20px',
  margin: 0,
});

export const link = style({
  color: vars.colors.primary,
  textDecoration: 'underline',
});
