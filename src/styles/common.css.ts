import { style } from '@vanilla-extract/css';

// 믹스인 객체 — style({ ...flexCenter }) 처럼 스프레드해서 사용
export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

export const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
} as const;

export const ellipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
} as const;

// 독립 클래스 — className으로 직접 적용
export const flexCenterClass = style(flexCenter);
export const flexBetweenClass = style(flexBetween);
export const ellipsisClass = style(ellipsis);
