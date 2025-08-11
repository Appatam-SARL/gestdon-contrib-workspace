// types/facebook.ts
export interface FacebookShareData {
  id: string;
  titre?: string;
  contenu: string;
  image?: string;
  url?: string;
  hashtag?: string;
}

export interface FacebookSDK {
  init: (params: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
  ui: (
    params: {
      method: string;
      href: string;
      quote?: string;
      hashtag?: string;
    },
    callback: (response: any) => void
  ) => void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
    fbAsyncInit: () => void;
  }
}
