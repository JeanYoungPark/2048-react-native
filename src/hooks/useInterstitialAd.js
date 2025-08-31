import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adRef = useRef(null);

  // 개발 모드에서는 테스트 ID 사용
  const adUnitId = __DEV__ 
    ? TestIds.INTERSTITIAL 
    : Platform.select({
        ios: 'ca-app-pub-2131681508611108/9044386890', // iOS 전면 광고 ID
        android: 'ca-app-pub-2131681508611108/9044386890', // Android 전면 광고 ID
      });

  // 전면광고 인스턴스 생성
  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsLoaded(false);
      setIsLoading(false);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      // 광고 종료 후 새 광고 미리 로드
      loadAd();
    });

    adRef.current = interstitial;

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    };
  }, [adUnitId]);

  // 광고 로드 함수
  const loadAd = () => {
    if (adRef.current && !isLoading && !isLoaded) {
      setIsLoading(true);
      adRef.current.load();
    }
  };

  // 광고 표시 함수
  const showAd = () => {
    return new Promise((resolve, reject) => {
      if (adRef.current && isLoaded) {
        const unsubscribeClosed = adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
          unsubscribeClosed();
          resolve();
        });

        const unsubscribeError = adRef.current.addAdEventListener(AdEventType.ERROR, (error) => {
          unsubscribeError();
          reject(error);
        });

        adRef.current.show();
      } else {
        reject(new Error('광고가 로드되지 않음'));
      }
    });
  };

  // 랜덤 확률로 광고 표시 (30% 확률)
  const showAdWithProbability = (probability = 0.3) => {
    return new Promise((resolve) => {
      const shouldShowAd = Math.random() < probability;
      
      if (shouldShowAd && isLoaded) {
        showAd()
          .then(() => resolve({ shown: true }))
          .catch(() => resolve({ shown: false, error: '광고 표시 실패' }));
      } else {
        resolve({ shown: false, reason: shouldShowAd ? '광고 미로드' : '확률 미해당' });
      }
    });
  };

  // 초기 광고 로드
  useEffect(() => {
    loadAd();
  }, []);

  return {
    isLoaded,
    isLoading,
    loadAd,
    showAd,
    showAdWithProbability,
  };
};

export default useInterstitialAd;