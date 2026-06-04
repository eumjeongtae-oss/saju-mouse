'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // data-adsbygoogle-status 속성이 이미 있으면 AdSense가 초기화한 슬롯 — 중복 push 방지
    if (adRef.current?.getAttribute('data-adsbygoogle-status')) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트가 아직 로드되지 않은 경우 무시
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9683506902844084"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9683506902844084"
        data-ad-slot="4530783276"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
