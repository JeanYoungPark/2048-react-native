# 2048 React Native

React Native로 구현한 클래식 2048 퍼즐 게임입니다.

## 특징

- **클래식 2048 게임플레이**: 타일을 합쳐서 2048을 만드세요
- **부드러운 애니메이션**: 네이티브 드라이버 기반 고성능 애니메이션
- **로컬 저장소**: 최고 기록과 게임 진행 상황 자동 저장
- **터치 & 스와이프**: 직관적인 제스처 컨트롤
- **반응형 레이아웃**: 다양한 화면 크기 지원
- **오프라인 플레이**: 인터넷 연결 없이도 완전 플레이 가능

## 기술 스택

- **React Native**: 0.80.2
- **React**: 19.1.0
- **AsyncStorage**: 로컬 데이터 저장
- **Gesture Handler**: 스와이프 제스처 처리
- **Animated API**: 부드러운 타일 애니메이션

## 시작하기

### 사전 요구사항

- Node.js >= 18
- React Native CLI
- iOS: Xcode 12+
- Android: Android Studio

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd Game2048

# 의존성 설치
npm install

# iOS Pod 설치 (iOS만)
cd ios && pod install && cd ..
```

### 실행

```bash
# Metro 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행  
npm run android
```

## 게임 방법

1. **스와이프로 이동**: 상하좌우로 스와이프하여 타일을 이동시키세요
2. **타일 합치기**: 같은 숫자의 타일이 만나면 하나로 합쳐집니다
3. **2048 달성**: 2048 타일을 만들면 승리하지만, 계속 플레이할 수 있습니다
4. **게임 오버**: 더 이상 움직일 수 없으면 게임이 종료됩니다

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Game2048.js     # 메인 게임 컴포넌트
│   └── TileComponent.js # 개별 타일 컴포넌트
├── hooks/              # 커스텀 훅
│   └── useGame.js      # 게임 로직 훅
├── styles/             # 스타일 시트
│   └── GameStyles.js   # 게임 스타일 정의
└── utils/              # 유틸리티
    ├── GameEngine.js   # 게임 로직 엔진
    └── Storage.js      # 로컬 저장소 관리
```

## 주요 컴포넌트

### Game2048.js
- 메인 게임 화면
- 스와이프 제스처 처리
- 게임 상태 표시

### TileComponent.js  
- 개별 타일 렌더링
- 애니메이션 처리
- 위치 및 스케일 변환

### GameEngine.js
- 게임 로직 구현
- 타일 이동 및 합치기
- 승리/패배 조건 확인

### Storage.js
- 최고 기록 저장/불러오기
- 게임 상태 저장/복원
- AsyncStorage 래퍼

## 개발 명령어

```bash
# 린트 검사
npm run lint

# 테스트 실행
npm test

# 빌드 (iOS)
npx react-native run-ios --configuration Release

# 빌드 (Android)
npx react-native run-android --variant=release
```

## 플랫폼 지원

- **iOS**: 12.0+
- **Android**: API 21+ (Android 5.0+)

## 데이터 저장

- **최고 기록**: 로컬 디바이스에 영구 저장
- **게임 상태**: 자동 저장/복원
- **오프라인**: 인터넷 연결 불필요
- **프라이버시**: 모든 데이터는 로컬에만 저장

## 문제 해결

### Metro 서버 이슈
```bash
# Metro 캐시 정리
npx react-native start --reset-cache
```

### iOS 빌드 이슈
```bash
# Pod 재설치
cd ios && rm -rf Pods && pod install
```

### Android 빌드 이슈
```bash
# Gradle 캐시 정리
cd android && ./gradlew clean
```

## 라이선스

MIT License