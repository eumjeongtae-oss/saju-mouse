import { useRef, useState } from 'react';

export function useResultActions() {
  const [showToast, setShowToast] = useState(false);
  const [showCoffeeToast, setShowCoffeeToast] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const handleKakaoShare = async () => {
    if (typeof window === 'undefined') return;

    if (!window.Kakao) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
        document.head.appendChild(script);
      }).catch(() => {
        alert('카카오톡 SDK 로드에 실패했어요. 잠시 후 다시 시도해 보세요.');
        return;
      });
    }

    if (!window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '');
    }

    const siteUrl = window.location.origin;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '찍쥐 - AI 사주 운세',
        description: '찍쥐가 당신의 사주팔자와 운세를 명쾌하게 풀어드려요!',
        imageUrl: siteUrl.includes('localhost')
          ? 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png'
          : `${siteUrl}/og-image.png`,
        link: {
          mobileWebUrl: siteUrl,
          webUrl: siteUrl,
        },
      },
      buttons: [
        {
          title: '운세 보러 가기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    });
  };

  const handleCapture = async () => {
    if (!captureRef.current) return;
    setIsCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#F9FAFB',
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });
      const link = document.createElement('a');
      link.download = '찍쥐-사주풀이.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopyCoffeeAccount = () => {
    navigator.clipboard.writeText('100206753204').then(() => {
      setShowCoffeeToast(true);
      setTimeout(() => setShowCoffeeToast(false), 2000);
    });
  };

  return {
    showToast,
    showCoffeeToast,
    isCapturing,
    captureRef,
    handleCopyLink,
    handleKakaoShare,
    handleCapture,
    handleCopyCoffeeAccount,
  };
}
