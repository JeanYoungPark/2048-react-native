import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AdBanner = ({ style }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // 개발 모드에서는 테스트 ID 사용, 프로덕션에서는 실제 ID
  const adUnitId = __DEV__ 
    ? TestIds.BANNER 
    : Platform.select({
        ios: 'ca-app-pub-2131681508611108/5815588322', // iOS 배너 광고 ID
        android: 'ca-app-pub-2131681508611108/5815588322', // Android 배너 광고 ID
      });

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdFailedToLoad = (error) => {
    setAdError(true);
    setAdLoaded(false);
  };

  // 광고 로드 실패 시 숨김 처리
  if (adError) {
    return null;
  }

  return (
    <View style={[styles.adContainer, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    minHeight: 60, // 배너 광고 최소 높이
  },
});

export default AdBanner;