'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트가 아직 로드되지 않은 경우 무시
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-9683506902844084"
      data-ad-slot="4530783276"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
