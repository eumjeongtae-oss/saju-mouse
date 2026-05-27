interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareContent {
  title: string;
  description: string;
  imageUrl: string;
  link: KakaoShareLink;
}

interface KakaoShareButton {
  title: string;
  link: KakaoShareLink;
}

interface KakaoShareFeedParams {
  objectType: 'feed';
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
}

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: KakaoShareFeedParams) => void;
      };
    };
  }
}

export {};
