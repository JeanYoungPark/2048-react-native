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

## 🚀 빠른 시작 (권장)

### 새로운 개발자를 위한 원클릭 설정

```bash
# 저장소 클론
git clone <repository-url>
cd 2048-react-native

# 🎯 완전 자동화된 개발 환경 구성 (이것만 실행하면 됨!)
npm run onboard
```

**자동으로 처리되는 것들:**
- ✅ 환경 사전 검증 (Node.js, Xcode, CocoaPods)
- ✅ 의존성 자동 설치 (npm, CocoaPods)
- ✅ iOS 환경 동적 구성 (.xcode.env.local)
- ✅ 첫 번째 빌드 테스트
- ✅ 문제 발생 시 자동 진단 및 해결 방법 제시

### 수동 설정 (고급 사용자용)

```bash
# 1. 환경 검사
npm run health-check

# 2. 환경 설정
npm run setup-env

# 3. 의존성 설치
npm install
cd ios && pod install && cd ..

# 4. 앱 실행
npm run ios
```

### 사전 요구사항

- **Node.js >= 18** (자동 검증됨)
- **iOS: Xcode 12+** (macOS만)
- **Android: Android Studio** (선택사항)

> 💡 **팁:** `npm run onboard`가 누락된 도구를 자동으로 감지하고 설치 방법을 알려줍니다!

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

### 🎯 환경 관리 (신규)

```bash
npm run onboard       # 🚀 새 개발자 완전 자동 온보딩
npm run health-check  # 🏥 종합 환경 건강 검사
npm run setup-env     # ⚙️ 환경 자동 설정
npm run doctor        # 🔧 문제 진단 (health-check와 동일)
```

### 📱 앱 실행

```bash
npm run ios           # iOS 시뮬레이터 (포트 8082)
npm run android       # Android 에뮬레이터
npm start             # Metro 번들러만 시작
```

### 🛠️ 개발 도구

```bash
npm run lint          # 린트 검사
npm test              # 테스트 실행

# 릴리즈 빌드
npx react-native run-ios --configuration Release
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

## 🆘 문제 해결 (자동화됨)

### 🎯 첫 번째로 시도해야 할 것

```bash
# 🏥 종합 환경 진단 (문제 자동 감지 및 해결책 제시)
npm run health-check
```

### 🔧 일반적인 문제 해결

#### "Node.js를 찾을 수 없습니다"
```bash
npm run setup-env  # 동적 경로 자동 설정
```

#### "PhaseScriptExecution failed" (iOS)
```bash
npm run setup-env  # iOS 환경 재구성
cd ios && pod install
```

#### 환경이 완전히 망가진 경우
```bash
npm run onboard  # 처음부터 완전 자동 재설정
```

### 🛠️ 수동 문제 해결 (고급)

#### Metro 서버 이슈
```bash
npx react-native start --reset-cache
```

#### iOS 빌드 이슈
```bash
cd ios && rm -rf Pods && pod install
```

#### Android 빌드 이슈
```bash
cd android && ./gradlew clean
```

> 💡 **팁:** 대부분의 환경 문제는 `npm run health-check`가 자동으로 진단하고 해결 방법을 알려줍니다!
> 
> 📖 **상세 가이드:** [DEVELOPMENT-ENVIRONMENT.md](./DEVELOPMENT-ENVIRONMENT.md)에서 완전한 문제 해결 가이드를 확인하세요.

## 라이선스

MIT License