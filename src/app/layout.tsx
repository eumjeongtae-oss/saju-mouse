import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/global.css';
import { Providers } from './providers';
import { Logo } from '@/components/Logo';
import * as styles from './layout.css';

// Vercel 환경에서 환경변수가 없더라도 배포 도메인이 정상적으로 들어가도록 처리합니다.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') 
  ? 'https://saju-mouse.vercel.app' 
  : (process.env.NEXT_PUBLIC_SITE_URL || 'https://saju-mouse.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '찍찍사주 - 귀여운 쥐와 함께하는 나만의 운세 🔮',
  description: '하찮고 귀여운 쥐 마스코트 찍쥐가 명쾌하게 풀어주는 현대적인 사주팔자/만세력 서비스다 ',
  openGraph: {
    title: '찍찍사주 - 귀여운 쥐와 함께하는 나만의 운세 🔮',
    description: '하찮고 귀여운 쥐 마스코트 찍쥐가 명쾌하게 풀어주는 현대적인 사주팔자/만세력 서비스다 ',
    images: [
      {
        url: '/kakaotalk-profile.png',
        width: 600,
        height: 600,
        alt: '찍찍사주 미리보기',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '찍찍사주 - 귀여운 쥐와 함께하는 나만의 운세 🔮',
    description: '하찮고 귀여운 쥐 마스코트 찍쥐가 명쾌하게 풀어주는 현대적인 사주팔자/만세력 서비스다 ',
    images: ['/kakaotalk-profile.png'],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <Providers>
          <div className={styles.container}>
            {/* 공통 브랜드 헤더 */}
            <header className={styles.header}>
              <Logo size="md" />
            </header>

            {/* 개별 페이지 본문 렌더링 */}
            <main className={styles.main}>
              {children}
            </main>

            {/* 공통 하단 푸터 */}
            <footer className={styles.footer}>
              <p className={styles.footerCopyright}>
                © {new Date().getFullYear()} 찍찍사주. All rights reserved.
              </p>
              <div className={styles.footerLinks}>
                <a href="mailto:eumjeongtae@gmail.com" className={styles.footerLink}>
                  Contact
                </a>
                <span className={styles.footerDivider}>·</span>
                <a href="/privacy" className={styles.footerLink}>
                  개인정보처리방침
                </a>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
