import React from 'react';
import { Metadata } from 'next';
import * as styles from './page.css';

export const metadata: Metadata = {
  title: '사주명리학 가이드 - 찍찍사주',
  description: '사주명리학(사주팔자)의 기본 개념, 십성이란 무엇인지, 주요 신살(도화살, 역마살 등)의 의미와 현대적 해석 방법에 대한 상세 가이드입니다.',
};

export default function GuidePage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headerTitle}>사주명리학 가이드</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>사주팔자(四柱八字)란 무엇인가요?</h2>
        <p className={styles.paragraph}>
          사주팔자(四柱八字)는 사람이 태어난 연, 월, 일, 시의 네 가지 기둥(사주)과 여덟 개의 글자(팔자)를 통해 그 사람의 선천적인 기운과 운명의 흐름을 분석하는 동양 철학의 한 분야입니다. 
          이는 단순히 미래를 점치는 것을 넘어, 자연의 이치인 음양오행(陰陽五行)의 상호작용을 통해 개인의 성향, 장단점, 그리고 인생의 주기를 파악하는 통계적이고 논리적인 학문입니다.
        </p>
        <p className={styles.paragraph}>
          찍찍사주는 이러한 고전 명리학의 깊이 있는 이론을 바탕으로, AI 기술을 결합하여 현대인들의 삶에 맞는 긍정적이고 실용적인 해석을 제공합니다. 
          어려운 한자어 대신 누구나 이해하기 쉬운 친근한 언어로 나의 진짜 무기(장점)를 찾아드리는 것을 목표로 하고 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>만세력과 명식, 그리고 음양오행</h2>
        <p className={styles.paragraph}>
          사주를 보기 위해서는 가장 먼저 본인의 생년월일시를 바탕으로 '명식(만세력)'을 뽑아야 합니다. 명식은 목(木), 화(火), 토(土), 금(金), 수(水)라는 오행으로 구성되어 있습니다.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>목(木)</strong>: 성장, 뻗어나가는 기운, 인자함과 창의성</li>
          <li className={styles.listItem}><strong>화(火)</strong>: 열정, 확산하는 기운, 예의와 화려함</li>
          <li className={styles.listItem}><strong>토(土)</strong>: 수용성, 포용과 안정, 믿음과 중재 능력</li>
          <li className={styles.listItem}><strong>금(金)</strong>: 결단력, 수렴하는 기운, 의리와 날카로움</li>
          <li className={styles.listItem}><strong>수(水)</strong>: 지혜, 응축하는 기운, 유연함과 생각의 깊이</li>
        </ul>
        <p className={styles.paragraph}>
          이 다섯 가지 기운이 내 사주에 어떻게 분포되어 있고 서로 어떤 영향을 주고받느냐에 따라 나만의 고유한 성향과 적성이 결정됩니다. 한 기운이 너무 많거나 적으면 이를 보완하는 방향으로 삶의 지혜를 찾는 것이 사주명리학의 핵심입니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>주요 신살(神殺)의 현대적 해석</h2>
        <p className={styles.paragraph}>
          과거에는 흉살이라고 불리며 부정적으로 해석되었던 많은 신살들이, 현대 사회에서는 오히려 특별한 매력과 재능(무기)으로 새롭게 재해석되고 있습니다. 대표적인 신살들은 다음과 같습니다.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>도화살(桃花殺):</strong> 과거에는 기생 사주라 불리며 꺼렸으나, 현대에는 연예인, 인플루언서, 크리에이터에게 필수적인 '대중의 시선을 끄는 강력한 매력'으로 해석됩니다.
          </li>
          <li className={styles.listItem}>
            <strong>역마살(驛馬殺):</strong> 한 곳에 정착하지 못하는 방랑벽으로 보았으나, 글로벌 시대인 현재는 무역, 외교, 해외 출장, 프리랜서 등 활동적이고 진취적인 성공의 기운으로 봅니다.
          </li>
          <li className={styles.listItem}>
            <strong>화개살(華蓋殺):</strong> 외롭고 고독한 성향으로 여겼지만, 예술적 감각, 철학적 사유, 고도의 집중력을 요구하는 전문직이나 예술 분야에서의 대성할 수 있는 재능입니다.
          </li>
          <li className={styles.listItem}>
            <strong>홍염살(紅艶殺):</strong> 도화살과 비슷하나 조금 더 은은하고 개인적인 매력을 뜻하며, 1:1 관계나 특정 매니아층을 형성하는 데 탁월한 기운입니다.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>운세를 대하는 올바른 자세</h2>
        <p className={styles.paragraph}>
          사주는 정해진 운명의 굴레가 아니라, 일기예보와 같습니다. 내일 비가 온다는 예보를 들으면 우산을 준비할 수 있듯이, 운의 흐름을 미리 알면 다가올 기회를 잡고 위기를 지혜롭게 피할 수 있습니다.
          찍찍사주가 전해드리는 조언을 통해 여러분의 잠재력을 깨우고 더 나은 내일을 설계해 보세요.
        </p>
      </section>
    </div>
  );
}
