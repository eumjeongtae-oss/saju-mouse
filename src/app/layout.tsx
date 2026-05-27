import type { Metadata } from 'next';
import '@/styles/global.css';
import { Providers } from './providers';
import { Logo } from '@/components/Logo';
import * as styles from './layout.css';

export const metadata: Metadata = {
  title: '찍찍사주 - 귀여운 쥐와 함께하는 나만의 운세 🔮',
  description: '하찮고 귀여운 쥐 마스코트 찍쥐가 명쾌하게 풀어주는 현대적인 사주팔자/만세력 서비스다 찍!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
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
              © {new Date().getFullYear()} 찍찍사주. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
