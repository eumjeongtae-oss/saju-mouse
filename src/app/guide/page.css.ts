import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  padding: vars.space.md,
  paddingBottom: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  color: vars.colors.text,
  lineHeight: 1.6,
});

export const headerTitle = style({
  fontSize: '24px',
  fontWeight: 700,
  color: vars.colors.text,
  marginBottom: vars.space.sm,
  textAlign: 'center',
});

export const section = style({
  backgroundColor: '#FFFFFF',
  borderRadius: vars.radii.lg,
  padding: vars.space.lg,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const sectionTitle = style({
  fontSize: '18px',
  fontWeight: 700,
  color: vars.colors.text,
  borderBottom: `2px solid ${vars.colors.primaryLight}`,
  paddingBottom: vars.space.sm,
  marginBottom: vars.space.xs,
});

export const paragraph = style({
  fontSize: '15px',
  color: vars.colors.textMuted,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
  margin: 0,
});

export const list = style({
  margin: 0,
  paddingLeft: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const listItem = style({
  fontSize: '15px',
  color: vars.colors.textMuted,
  lineHeight: 1.6,
});
