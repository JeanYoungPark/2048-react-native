# AdMob 광고 통합 가이드

React Native 2048 게임에 Google AdMob 광고 시스템이 통합되었습니다.

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
# 1. npm 패키지 설치
npm install react-native-google-mobile-ads

# 2. iOS Pod 설치 (iOS만)
cd ios && pod install && cd ..
```

### 2. Android 설정

#### `android/app/src/main/AndroidManifest.xml` 수정:

```xml
<application>
  <!-- 기존 application 내용... -->
  
  <!-- AdMob App ID 추가 -->
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713" />
    
</application>
```

### 3. iOS 설정

#### `ios/Game2048/Info.plist` 수정:

```xml
<dict>
  <!-- 기존 dict 내용... -->
  
  <!-- AdMob App ID 추가 -->
  <key>GADApplicationIdentifier</key>
  <string>ca-app-pub-3940256099942544~1458002511</string>
  
</dict>
```

### 4. 권한 설정 (선택적)

#### Android - `android/app/src/main/AndroidManifest.xml`:
```xml
<!-- 네트워크 접근 권한 (일반적으로 이미 존재) -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

#### iOS - `ios/Game2048/Info.plist`:
```xml
<!-- App Tracking Transparency (iOS 14+) -->
<key>NSUserTrackingUsageDescription</key>
<string>이 앱은 광고를 개인화하고 향상된 사용자 경험을 제공하기 위해 데이터를 사용합니다.</string>
```

## 📱 현재 구현된 기능

### 배너 광고
- **위치**: 게임 하단, 인스트럭션 아래
- **크기**: 320x50 (표준 배너)
- **표시 조건**: 광고 시스템 초기화 완료 시 자동 표시

### 전면 광고 (Interstitial)
- **게임 오버 시**: 자동 표시 (1초 지연)
- **재시작 버튼**: 간헐적 표시 (최소 1분 간격)
- **표시 조건**: 게임 상황과 시간 간격 고려

### 보상형 광고 (향후 확장 가능)
- **추가 이동 기회**: 3회 이동
- **실행 취소**: 1회 취소
- **힌트 기능**: 1회 힌트

## 🛠️ 개발 모드

현재 모든 광고는 **테스트 ID**를 사용합니다:

```javascript
// 개발용 테스트 ID들
const AD_UNIT_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',      // 안드로이드
  interstitial: 'ca-app-pub-3940256099942544/1033173712', // 안드로이드
  rewarded: 'ca-app-pub-3940256099942544/5224354917',     // 안드로이드
};
```

## 🔧 프로덕션 배포 시 설정

### 1. Google AdMob 계정 생성 및 앱 등록

1. [Google AdMob 콘솔](https://admob.google.com/)에서 계정 생성
2. 새 앱 등록 (iOS, Android 각각)
3. 광고 단위 생성 (배너, 전면, 보상형)

### 2. 실제 광고 ID로 교체

`src/ads/AdConfig.js` 파일의 ID들을 실제 광고 ID로 교체:

```javascript
export const ADMOB_CONFIG = {
  appId: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY', // 실제 iOS 앱 ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY', // 실제 Android 앱 ID
  }),
};

export const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // 실제 iOS 배너 ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // 실제 Android 배너 ID
  }),
  // ... 다른 광고 단위들
};
```

### 3. AndroidManifest.xml과 Info.plist의 앱 ID도 실제 ID로 교체

## 🎯 광고 최적화 팁

### 1. 광고 빈도 조절
- 전면 광고: 최소 1분 간격 유지
- 사용자 경험을 해치지 않는 선에서 표시

### 2. 광고 로딩 최적화
- 앱 시작 시 광고 미리 로드
- 네트워크 상태 확인 후 로드 시도

### 3. 에러 처리
- 광고 로드 실패 시 게임 진행에 영향 없도록 처리
- 적절한 fallback 로직 구현

## 🚨 문제 해결

### 1. 광고가 표시되지 않는 경우
- 네트워크 연결 상태 확인
- AdMob 계정 상태 확인 (승인 여부)
- 테스트 기기 등록 확인

### 2. 빌드 오류
```bash
# iOS Pod 문제
cd ios && rm -rf Pods && pod install

# Android Gradle 문제  
cd android && ./gradlew clean
```

### 3. 광고 정책 위반
- Google AdMob 정책 준수
- 부적절한 콘텐츠와의 연결 방지
- 클릭 유도 금지

## 📊 수익 추적

현재 구현된 수익 추적 기능:
- 광고 시청 횟수 기록
- 광고 유형별 통계
- AsyncStorage를 통한 로컬 저장

향후 확장 가능:
- Firebase Analytics 연동
- 실시간 수익 대시보드
- A/B 테스트 시스템

## 🔒 개인정보 보호

- GDPR 준수를 위한 동의 시스템 (향후 구현)
- COPPA 준수 설정 (어린이 대상 앱의 경우)
- 사용자 광고 설정 기능 (프리미엄 모드)