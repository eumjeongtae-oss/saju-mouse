import type { Metadata } from 'next';
import * as styles from './page.css';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 찍찍사주',
  description: '찍찍사주 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>개인정보처리방침</h1>
      <p className={styles.updated}>최종 수정일: 2025년 6월 1일</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 수집하는 개인정보 항목</h2>
        <p className={styles.text}>
          찍찍사주(이하 "서비스")는 사주 풀이 제공을 위해 아래 정보를 수집합니다.
        </p>
        <ul className={styles.list}>
          <li>생년월일 및 출생 시각</li>
          <li>성별</li>
          <li>양력/음력 구분</li>
        </ul>
        <p className={styles.text}>
          위 정보는 서버에 저장되지 않으며, 사주 명식 계산 및 AI 풀이 생성에만 일시적으로 사용됩니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 개인정보의 수집 및 이용 목적</h2>
        <ul className={styles.list}>
          <li>사주팔자(만세력) 명식 계산</li>
          <li>AI 기반 운세 풀이 생성</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용 기간</h2>
        <p className={styles.text}>
          입력하신 정보는 AI 풀이 결과를 생성하는 즉시 폐기되며, 별도로 저장·보관하지 않습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. 제3자 서비스</h2>
        <p className={styles.text}>
          서비스는 운세 풀이 생성을 위해 Google Gemini API를 사용합니다.
          Google의 개인정보 처리 방침은{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Google 개인정보처리방침
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. 이용자의 권리</h2>
        <p className={styles.text}>
          서비스는 개인정보를 저장하지 않으므로, 별도의 삭제·정정 요청이 필요하지 않습니다.
          개인정보 처리에 관한 문의는 아래 이메일로 연락해 주세요.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. 문의</h2>
        <p className={styles.text}>
          개인정보 관련 문의:{' '}
          <a href="mailto:eumjeongtae@gmail.com" className={styles.link}>
            eumjeongtae@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
