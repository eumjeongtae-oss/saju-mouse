'use client';

import React from 'react';

export type MascotPose = 'idle' | 'general' | 'yearly' | 'wealth' | 'love' | 'compatibility' | 'running';

interface MascotProps {
  pose: MascotPose;
  className?: string;
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({ pose, className, size = 160 }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <defs>
          {/* 하찮은 쥐 귀 씰룩씰룩 애니메이션 */}
          <style>{`
            @keyframes wiggleEarLeft {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-8deg); }
            }
            @keyframes wiggleEarRight {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg); }
            }
            @keyframes floatMascot {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            @keyframes heartbeat {
              0%, 100% { transform: scale(1) translateY(0); }
              50% { transform: scale(1.15) translateY(-3px); }
            }
            @keyframes spinCoin {
              0%, 100% { transform: rotate(0deg) scale(1); }
              50% { transform: rotate(180deg) scale(1.05); }
            }
            @keyframes blinkEyes {
              0%, 95%, 100% { transform: scaleY(1); }
              97.5% { transform: scaleY(0.1); }
            }
            @keyframes tailWag {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(15deg); }
            }
            @keyframes floatHeartLeft {
              0%, 100% { transform: translateY(0px) rotate(-12deg); }
              50% { transform: translateY(-8px) rotate(-12deg); }
            }
            @keyframes floatHeartRight {
              0%, 100% { transform: translateY(0px) rotate(12deg); }
              50% { transform: translateY(-6px) rotate(12deg); }
            }
            .heart-float-left {
              animation: floatHeartLeft 2.8s ease-in-out infinite;
            }
            .heart-float-right {
              animation: floatHeartRight 3.2s ease-in-out infinite;
            }

            .ear-left {
              transform-origin: 50px 50px;
              animation: wiggleEarLeft 4s ease-in-out infinite;
            }
            .ear-right {
              transform-origin: 110px 50px;
              animation: wiggleEarRight 4.2s ease-in-out infinite;
            }
            .mascot-body-group {
              animation: floatMascot 5s ease-in-out infinite;
              transform-origin: center;
            }
            .eye-blink {
              transform-origin: center 80px;
              animation: blinkEyes 4.5s infinite;
            }
            .heart-glow {
              transform-origin: 80px 20px;
              animation: heartbeat 2s ease-in-out infinite;
            }
            .gold-coin {
              transform-origin: 80px 18px;
              animation: spinCoin 4s ease-in-out infinite;
            }
            .mouse-tail {
              transform-origin: 35px 125px;
              animation: tailWag 2.5s ease-in-out infinite;
            }
            @keyframes runBounce {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px); }
            }
            .mascot-run-bounce {
              animation: runBounce 0.3s ease-in-out infinite;
              transform-origin: center;
            }
            @keyframes runFootLeft {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(-15deg); }
            }
            @keyframes runFootRight {
              0%, 100% { transform: translateY(-8px) rotate(-15deg); }
              50% { transform: translateY(0px) rotate(0deg); }
            }
            .run-foot-left {
              animation: runFootLeft 0.3s ease-in-out infinite;
              transform-origin: 55px 130px;
            }
            .run-foot-right {
              animation: runFootRight 0.3s ease-in-out infinite;
              transform-origin: 105px 130px;
            }
          `}</style>

          {/* 그라데이션 정의 */}
          <linearGradient id="bodyGrad" x1="80" y1="40" x2="80" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
          <linearGradient id="coinGrad" x1="80" y1="5" x2="80" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="shadow" x="10" y="110" width="140" height="40" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* 1. 하찮은 바닥 그림자 */}
        <ellipse cx="80" cy="132" rx="42" ry="7" fill="#E5E7EB" />

        {/* 메인 쥐 그룹 (둥둥 떠다님 혹은 뜀박질) */}
        <g className={pose === 'running' ? "mascot-run-bounce" : "mascot-body-group"}>
          {/* 2. 꼬리 */}
          <path
            className="mouse-tail"
            d="M38 123C25 125 15 115 15 105C15 98 22 95 24 98C26 101 20 105 22 110C24 115 32 117 38 118"
            stroke="#FFA5D2"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3. 쥐 귀 (왼쪽, 오른쪽) */}
          <g className="ear-left">
            <circle cx="50" cy="50" r="22" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="14" fill="#FFA5D2" />
          </g>
          <g className="ear-right">
            <circle cx="110" cy="50" r="22" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2.5" />
            <circle cx="110" cy="50" r="14" fill="#FFA5D2" />
          </g>

          {/* 4. 뚱뚱한 찹쌀떡 몸통 */}
          <path
            d="M38 105C38 68 53 58 80 58C107 58 122 68 122 105C122 128 105 131 80 131C55 131 38 128 38 105Z"
            fill="url(#bodyGrad)"
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* 5. 하찮은 짧은 발 */}
          <g className={pose === 'running' ? "run-foot-left" : ""}>
            <circle cx="55" cy="130" r="6" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2.5" />
          </g>
          <g className={pose === 'running' ? "run-foot-right" : ""}>
            <circle cx="105" cy="130" r="6" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2.5" />
          </g>

          {/* 6. 발그레 볼터치 */}
          <circle cx="56" cy="99" r="6" fill="#FFA5D2" fillOpacity="0.75" />
          <circle cx="104" cy="99" r="6" fill="#FFA5D2" fillOpacity="0.75" />

          {/* 7. 귀여운 분홍 코 */}
          <polygon points="76,93 84,93 80,97" fill="#FF70B6" stroke="#1F2937" strokeWidth="1.5" strokeLinejoin="round" />

          {/* 8. 수염 (하찮게 세 갈래) */}
          <path d="M28 92L16 90" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M27 98L14 99" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M132 92L144 90" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M133 98L146 99" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />

          {/* 9. 포즈별 눈 및 입, 특수 데코레이션 렌더링 */}
          {pose === 'idle' && (
            <>
              {/* 눈 - 멀뚱멀뚱 깜빡임 */}
              <g className="eye-blink">
                <circle cx="64" cy="88" r="4.5" fill="#1F2937" />
                <circle cx="96" cy="88" r="4.5" fill="#1F2937" />
              </g>
              {/* 입 - ㅅ 모양 */}
              <path d="M76 102C78 104 80 104 80 104C80 104 82 104 84 102" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {pose === 'general' && (
            <>
              {/* 눈 - 한쪽 눈 윙크하듯이 하찮음 */}
              <g className="eye-blink">
                <circle cx="64" cy="88" r="4.5" fill="#1F2937" />
                <circle cx="96" cy="88" r="4.5" fill="#1F2937" />
              </g>
              {/* 입 - 오물오물 점 */}
              <circle cx="80" cy="103" r="2.5" fill="#1F2937" />

              {/* 조선 시대 선비 갓 (머리 위에 약간 삐딱하게 올려진 하찮은 갓) */}
              <g transform="translate(80, 58) rotate(-8)">
                {/* 갓 챙 (아래 타원) */}
                <ellipse cx="0" cy="-6" rx="36" ry="6" fill="#1F2937" stroke="#1F2937" strokeWidth="1" />
                {/* 갓 모자 (원기둥) */}
                <path d="M-15 -6L-10 -26C-10 -26 -2 -28 0 -28C2 -28 10 -26 10 -26L15 -6Z" fill="#111827" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round" />
                {/* 갓 끈 (하찮게 흘러내리는 끈) */}
                <path d="M-12 -6C-15 15 -10 32 -10 32" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M12 -6C15 15 10 32 10 32" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>

              {/* 돋보기 (선비 쥐의 연구 소품) */}
              <g transform="translate(108, 102) rotate(20)">
                <line x1="0" y1="0" x2="16" y2="16" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="0" cy="0" r="10" stroke="#1F2937" strokeWidth="3" fill="#A78BFA" fillOpacity="0.4" />
                <path d="M-5 -5Q-2 -7 1 -5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </>
          )}

          {pose === 'yearly' && (
            <>
              {/* 눈 - 웃는 눈 ^ ^ */}
              <path d="M60 90Q64 85 68 90" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M92 90Q96 85 100 90" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* 입 - 활짝 벌린 세모 입 */}
              <path d="M76 102Q80 107 84 102Z" fill="#F87171" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round" />

              {/* 머리 위 복주머니 (하찮게 아슬아슬 얹혀 있음) */}
              <g transform="translate(80, 56)">
                {/* 복주머니 몸통 */}
                <path d="M-16 -8C-22 -8 -22 14 -12 20C-2 24 12 24 22 20C32 14 32 -8 26 -8C22 -8 18 -2 18 -2C18 -2 10 -6 0 -6C-10 -6 -18 -2 -18 -2C-18 -2 -22 -8 -16 -8Z" fill="#EF4444" stroke="#1F2937" strokeWidth="2.5" strokeLinejoin="round" />
                {/* 금색 복주머니 리본 주름 */}
                <circle cx="0" cy="-2" r="3.5" fill="#FBBF24" stroke="#1F2937" strokeWidth="1.5" />
                <path d="M-6 -2L-12 -6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 -2L12 -6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                {/* 삐뚤빼뚤 복(福) 자 노란 서클 */}
                <circle cx="0" cy="9" r="6" fill="#FBBF24" stroke="#1F2937" strokeWidth="1.5" />
                {/* 삐뚤한 십자 (하찮은 복자 약식 표현) */}
                <path d="M-3 9H3M0 6V12" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </>
          )}

          {pose === 'wealth' && (
            <>
              {/* 눈 - 황금 엽전 사각형 구멍난 눈 🪙🪙 */}
              <g>
                {/* 왼쪽 엽전눈 */}
                <rect x="58" y="82" width="13" height="13" rx="2.5" fill="#FBBF24" stroke="#1F2937" strokeWidth="2.5" />
                <rect x="63.5" y="87.5" width="2" height="2" fill="#1F2937" />
                {/* 오른쪽 엽전눈 */}
                <rect x="89" y="82" width="13" height="13" rx="2.5" fill="#FBBF24" stroke="#1F2937" strokeWidth="2.5" />
                <rect x="94.5" y="87.5" width="2" height="2" fill="#1F2937" />
              </g>
              {/* 입 - 삐쭉 벌어진 멍청입 */}
              <ellipse cx="80" cy="103" rx="4" ry="2.5" fill="#1F2937" />

              {/* 머리 위 황금 동전 탑 (아슬아슬하게 흔들림) */}
              <g className="gold-coin" transform="translate(80, 48)">
                {/* 아래쪽 동전 */}
                <ellipse cx="0" cy="8" rx="14" ry="6" fill="url(#coinGrad)" stroke="#1F2937" strokeWidth="2" />
                <rect x="-3" y="6" width="6" height="4" fill="none" stroke="#1F2937" strokeWidth="1.5" />

                {/* 위쪽 동전 (약간 어긋남) */}
                <ellipse cx="-4" cy="-2" rx="12" ry="5.5" fill="url(#coinGrad)" stroke="#1F2937" strokeWidth="2" />
                <rect x="-7" y="-4" width="6" height="4" fill="none" stroke="#1F2937" strokeWidth="1.5" />
              </g>

              {/* 돈 냄새를 맡고 흐르는 땀 한 방울 */}
              <path d="M124 88C127 88 128 92 125 94C123 96 121 93 121 91C121 89 122 88 124 88Z" fill="#60A5FA" />
            </>
          )}

          {pose === 'compatibility' && (
            <>
              {/* 눈 - 반짝이는 별 눈 ★★ */}
              <text x="58" y="95" fontSize="14" textAnchor="middle" fill="#EC4899" fontWeight="900">★</text>
              <text x="102" y="95" fontSize="14" textAnchor="middle" fill="#EC4899" fontWeight="900">★</text>
              {/* 입 - 만족스러운 큰 웃음 */}
              <path d="M72 103Q80 110 88 103" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* 볼터치 */}
              <circle cx="56" cy="99" r="7" fill="#F9A8D4" fillOpacity="0.85" />
              <circle cx="104" cy="99" r="7" fill="#F9A8D4" fillOpacity="0.85" />

              {/* 왼쪽 둥둥 하트 */}
              <g className="heart-float-left" transform="translate(22, 68)">
                <path
                  d="M0 -6C-4 -11 -11 -7 -7 -1L0 5L7 -1C11 -7 4 -11 0 -6Z"
                  fill="#F472B6"
                  stroke="#1F2937"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              {/* 오른쪽 둥둥 하트 */}
              <g className="heart-float-right" transform="translate(138, 62)">
                <path
                  d="M0 -8C-6 -14 -14 -9 -10 -2L0 6L10 -2C14 -9 6 -14 0 -8Z"
                  fill="#F43F5E"
                  stroke="#1F2937"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>

              {/* 머리 위 두 손가락 하트 표시 */}
              <g transform="translate(80, 53)">
                {/* 작은 하트 왼쪽 */}
                <path
                  d="M-10 -4C-13 -8 -18 -5 -15 -1L-10 3L-5 -1C-2 -5 -7 -8 -10 -4Z"
                  fill="#FCA5A5"
                  stroke="#1F2937"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* 작은 하트 오른쪽 */}
                <path
                  d="M10 -4C7 -8 2 -5 5 -1L10 3L15 -1C18 -5 13 -8 10 -4Z"
                  fill="#FCA5A5"
                  stroke="#1F2937"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </g>
            </>
          )}

          {pose === 'love' && (
            <>
              {/* 눈 - 행복하게 감은 눈 > < */}
              <path d="M58 85L68 91L58 97" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M102 85L92 91L102 97" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* 입 - 활짝 3 모양의 고양이 입 */}
              <path d="M74 102C76 104 78 104 80 102C82 104 84 102" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* 볼터치를 왕하트로 덮어씌움 */}
              <path d="M50 96C47 93 42 96 45 101L50 106L55 101C58 96 53 93 50 96Z" fill="#F87171" />
              <path d="M110 96C107 93 102 96 105 101L110 106L115 101C118 96 113 93 110 96Z" fill="#F87171" />

              {/* 머리 위에 뿅 솟은 핑크 하트 안테나 */}
              <g className="heart-glow" transform="translate(80, 52)">
                <line x1="0" y1="5" x2="0" y2="-8" stroke="#1F2937" strokeWidth="2.5" />
                <path
                  d="M0 -10C-5 -15 -12 -10 -8 -4L0 2L8 -4C12 -10 5 -15 0 -10Z"
                  fill="#EF4444"
                  stroke="#1F2937"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            </>
          )}

          {pose === 'running' && (
            <>
              {/* 눈 - > < */}
              <path d="M58 85L68 91L58 97" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M102 85L92 91L102 97" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* 입 - 헥헥거리는 혓바닥 */}
              <path d="M74 102C76 105 84 105 86 102" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M76 103C76 109 84 109 84 103Z" fill="#F87171" stroke="#1F2937" strokeWidth="1.5" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
