import { useEffect, useState } from 'react';

const FACEBOOK_APP_ID = '1121060219880082';

export const useFacebookSDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Vérifier si le SDK est déjà chargé
    if (window.FB) {
      setIsLoaded(true);
      setIsInitialized(true);
      return;
    }

    // Initialiser le SDK Facebook
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
      setIsInitialized(true);
    };

    // Charger le SDK si pas déjà fait
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup optionnel
    };
  }, []);

  return { isLoaded, isInitialized };
};
