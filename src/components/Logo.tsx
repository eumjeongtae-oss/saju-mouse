'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  // 사이즈별 크기 계산
  const dimensions = {
    sm: { width: 140, height: 40, iconSize: 28, fontSize: '16px' },
    md: { width: 190, height: 50, iconSize: 36, fontSize: '20px' },
    lg: { width: 240, height: 60, iconSize: 44, fontSize: '24px' },
  }[size];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* 하찮고 귀여운 쥐 로고 아이콘 (SVG) */}
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        {/* 왼쪽 귀 */}
        <circle cx="28" cy="30" r="16" fill="#E5E7EB" />
        <circle cx="28" cy="30" r="10" fill="#FFA5D2" />

        {/* 오른쪽 귀 */}
        <circle cx="72" cy="30" r="16" fill="#E5E7EB" />
        <circle cx="72" cy="30" r="10" fill="#FFA5D2" />

        {/* 얼굴/몸통 (찹쌀떡 모양 둥근 쥐) */}
        <path
          d="M20 65C20 40 33 32 50 32C67 32 80 40 80 65C80 82 67 85 50 85C33 85 20 82 20 65Z"
          fill="#F3F4F6"
        />

        {/* 하찮은 쥐 눈 (멀리 떨어진 작은 점) */}
        <circle cx="38" cy="52" r="3.5" fill="#1F2937" />
        <circle cx="62" cy="52" r="3.5" fill="#1F2937" />

        {/* 하찮은 쥐 입 (ㅅ 모양) */}
        <path
          d="M47 62C48.5 63.5 50 63.5 50 63.5C50 63.5 51.5 63.5 53 62"
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 분홍색 작은 코 */}
        <ellipse cx="50" cy="58" rx="4" ry="2.5" fill="#FF70B6" />

        {/* 발그레 볼터치 */}
        <circle cx="32" cy="59" r="4.5" fill="#FFA5D2" fillOpacity="0.6" />
        <circle cx="68" cy="59" r="4.5" fill="#FFA5D2" fillOpacity="0.6" />

        {/* 수염 (가느다란 두 줄기) */}
        <path d="M12 55L22 56" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 62L20 61" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 55L78 56" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <path d="M89 62L80 61" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />

        {/* 신비로운 아기별 (로고 포인트) */}
        <path
          d="M50 10L52 14L57 14.5L53.5 18L54.5 23L50 20.5L45.5 23L46.5 18L43 14.5L48 14L50 10Z"
          fill="#A78BFA"
        />

        {/* 돋보기 (하찮게 들고 있는 느낌) */}
        <g transform="translate(68, 62) rotate(15)">
          <line x1="0" y1="0" x2="12" y2="12" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="0" r="7" stroke="#7C3AED" strokeWidth="3" fill="#E0E7FF" fillOpacity="0.8" />
          {/* 돋보기 반짝임 */}
          <path d="M-3 -3Q-1 -4 1 -3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>

      {/* 브랜드 텍스트 */}
      <span
        style={{
          fontFamily: 'Outfit, Inter, system-ui, -apple-system, sans-serif',
          fontWeight: 800,
          fontSize: dimensions.fontSize,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #1F2937 0%, #4B5563 50%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        찍찍사주
      </span>
    </div>
  );
};
