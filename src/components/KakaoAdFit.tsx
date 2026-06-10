'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
  unit: string;
  width: string;
  height: string;
  className?: string;
}

export function KakaoAdFit({ unit, width, height, className }: KakaoAdFitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 광고가 들어갈 부모 컨테이너
    const container = adRef.current;
    if (!container) return;

    // 이미 iframe(광고)가 생성되어 있다면 중복 로드 방지
    if (container.querySelector('iframe')) return;

    // 기존에 추가된 ins와 script 태그가 있다면 초기화
    container.innerHTML = '';

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', width);
    ins.setAttribute('data-ad-height', height);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.kakaocdn.net/kas/static/ba.min.js';
    script.async = true;

    container.appendChild(ins);
    container.appendChild(script);

  }, [unit, width, height]);

  return (
    <div
      ref={adRef}
      className={className}
      style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}
    />
  );
}
