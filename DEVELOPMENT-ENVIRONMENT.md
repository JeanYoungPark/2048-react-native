# 🚀 React Native 2048 개발 환경 가이드

> **동적 환경 관리 시스템**으로 개발자 간 환경 차이 문제를 완전히 해결하고 빠른 온보딩을 지원합니다.

## 📋 목차

- [🎯 새로운 개발자 빠른 시작](#-새로운-개발자-빠른-시작)
- [🛠️ 환경 관리 명령어](#️-환경-관리-명령어)
- [🔧 시스템 아키텍처](#-시스템-아키텍처)
- [❗ 문제 해결](#-문제-해결)
- [🔄 환경 동기화](#-환경-동기화)
- [📊 성능 최적화](#-성능-최적화)

---

## 🎯 새로운 개발자 빠른 시작

### 1️⃣ 원클릭 자동 설정 (권장)

```bash
# 저장소 클론 후
cd 2048-react-native

# 🚀 완전 자동화된 개발 환경 구성
npm run onboard
```

**이 명령어 하나로:**
- ✅ 환경 사전 검증
- ✅ 의존성 자동 설치
- ✅ iOS 환경 자동 구성
- ✅ 첫 번째 빌드 테스트
- ✅ 문제 발생 시 자동 진단 및 해결 방법 제시

### 2️⃣ 수동 설정 (고급 사용자)

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

---

## 🛠️ 환경 관리 명령어

### 📱 앱 실행 명령어

```bash
npm run ios           # iOS 시뮬레이터에서 앱 실행 (포트 8082)
npm run android       # Android 에뮬레이터에서 앱 실행
npm start             # Metro 번들러만 시작
```

### 🔧 환경 관리 명령어

```bash
npm run setup-env     # 환경 자동 설정 (Node.js 경로 동적 감지)
npm run env-check     # 환경 상태 빠른 확인
npm run health-check  # 종합 환경 건강 검사 (상세 진단)
npm run doctor        # health-check의 별칭
```

### 🎯 개발자 도구

```bash
npm run onboard       # 새 개발자 완전 자동 온보딩
npm run dev-setup     # onboard의 별칭
```

---

## 🔧 시스템 아키텍처

### 동적 환경 관리 시스템 구조

```
scripts/
├── setup-env.js       # 🎯 환경 자동 설정
├── dev-onboarding.js  # 🚀 개발자 온보딩 자동화
└── health-check.js    # 🏥 환경 건강 검사

ios/
├── .xcode.env         # 📝 기본 환경 설정 (버전 관리됨)
└── .xcode.env.local   # 🔧 개인 환경 설정 (자동 생성, Git 제외)
```

### 환경 파일 관리 전략

| 파일 | 관리 방식 | 목적 | 예시 |
|------|-----------|------|------|
| `ios/.xcode.env` | **Git 추적** | 기본 설정, 팀 공유 | `export NODE_BINARY=$(command -v node)` |
| `ios/.xcode.env.local` | **자동 생성** | 개인 환경별 설정 | 사용자별 경로, 버전 정보 |
| `.gitignore` | **Git 추적** | 환경 파일 제외 규칙 | `ios/.xcode.env.local` |

---

## ❗ 문제 해결

### 🆘 일반적인 문제 및 해결 방법

#### 1. **"Node.js를 찾을 수 없습니다"**

```bash
# 자동 해결
npm run setup-env

# 수동 확인
which node
node --version
```

**원인:** 하드코딩된 Node.js 경로 또는 PATH 문제
**해결:** 동적 경로 설정으로 자동 해결됨

#### 2. **"PhaseScriptExecution failed"**

```bash
# 종합 진단 실행
npm run health-check

# 환경 재설정
npm run setup-env
cd ios && pod install
```

**원인:** iOS 빌드 스크립트에서 Node.js 경로 문제
**해결:** 환경 설정 스크립트가 자동으로 올바른 경로 설정

#### 3. **"Metro 서버가 이미 실행 중"**

```bash
# 실행 중인 Metro 서버 확인
lsof -ti:8082

# 종료 후 재시작
npx react-native start --reset-cache --port 8082
```

#### 4. **빌드 시간이 너무 오래 걸림**

```bash
# 성능 진단
npm run health-check

# 캐시 정리 후 재빌드
npm start -- --reset-cache
```

### 🔍 고급 진단 도구

```bash
# 상세 환경 정보 확인
npm run health-check

# Node.js 설치 방식 확인 (nvm, brew, system)
node -e "console.log(process.execPath)"

# iOS 시뮬레이터 목록
xcrun simctl list devices

# CocoaPods 캐시 상태
pod cache list
```

---

## 🔄 환경 동기화

### 팀 간 환경 일관성 유지

1. **새로운 팀원 합류 시:**
   ```bash
   git clone <repository>
   cd 2048-react-native
   npm run onboard  # 🎯 이것만 실행하면 됨!
   ```

2. **환경 변경 후 동기화:**
   ```bash
   npm run setup-env  # Node.js 버전 변경 시
   cd ios && pod install  # iOS 의존성 변경 시
   ```

3. **문제 발생 시 환경 초기화:**
   ```bash
   # 완전 초기화 (강력한 방법)
   rm -rf node_modules ios/Pods ios/.xcode.env.local
   npm install
   npm run setup-env
   cd ios && pod install
   ```

### 환경 차이 방지 전략

- ✅ **하드코딩 금지:** 모든 경로를 동적으로 관리
- ✅ **자동 생성:** 환경별 파일을 스크립트로 생성
- ✅ **Git 제외:** 개인 환경 파일은 버전 관리 제외
- ✅ **자동 검증:** 설치 후 자동으로 환경 검사

---

## 📊 성능 최적화

### 빌드 성능 개선

```bash
# 1. Metro 캐시 최적화
npm start -- --reset-cache

# 2. CocoaPods 캐시 정리
cd ios && pod cache clean --all && pod install

# 3. Xcode 파생 데이터 정리
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 개발 워크플로 최적화

```bash
# 빠른 개발 사이클
npm start                    # Terminal 1: Metro 서버
npm run ios                  # Terminal 2: iOS 앱 실행

# 디버깅 모드
npm run start:interactive    # 컬러 출력 및 인터랙티브 모드
```

---

## 🔧 고급 설정

### 사용자 정의 환경 설정

`.xcode.env.local` 파일을 수동으로 수정하려면:

```bash
# ❌ 직접 수정하지 마세요
# ✅ 대신 이렇게 하세요:
npm run setup-env
```

### 개발 도구 통합

```bash
# VS Code 설정 (권장)
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss

# Flipper 디버깅 (선택사항)
npx flipper-server
```

---

## 📝 베스트 프랙티스

### ✅ 권장사항

1. **새 프로젝트 시작 시:**
   - `npm run onboard` 먼저 실행
   - 문제 발생 시 `npm run health-check`로 진단

2. **Node.js 버전 변경 시:**
   - `npm run setup-env` 실행
   - `npm run health-check`로 검증

3. **팀 공유 시:**
   - 환경별 파일은 Git에서 제외
   - 문서화된 설정 과정 공유

### ❌ 피해야 할 것들

- ❌ `.xcode.env.local` 파일 직접 수정
- ❌ 절대 경로 하드코딩
- ❌ 환경 파일을 Git에 커밋
- ❌ 수동 환경 설정 (자동화 도구 사용)

---

## 🆘 지원 및 도움말

### 자주 묻는 질문 (FAQ)

**Q: 새로운 맥북에서 프로젝트를 실행하려면 어떻게 해야 하나요?**
A: `git clone` 후 `npm run onboard` 한 번만 실행하면 됩니다.

**Q: Node.js 버전을 업그레이드 했는데 빌드가 안됩니다.**
A: `npm run setup-env`를 실행해서 새 경로를 자동으로 설정하세요.

**Q: iOS 빌드가 계속 실패합니다.**
A: `npm run health-check`를 실행해서 문제를 진단하고 해결 방법을 확인하세요.

### 추가 도움 받기

- 🔍 **환경 진단:** `npm run health-check`
- 📖 **상세 로그:** `npm run ios --verbose`
- 🛠️ **환경 재설정:** `npm run setup-env`
- 👥 **팀 멤버 문의**

---

## 📚 관련 문서

- [React Native 공식 문서](https://reactnative.dev/docs/environment-setup)
- [iOS 개발 환경 설정](https://reactnative.dev/docs/environment-setup#ios-development-environment)
- [CocoaPods 가이드](https://cocoapods.org/)

---

**💡 팁:** 이 문서는 동적 환경 관리 시스템을 기반으로 작성되었습니다. 문제가 발생하면 먼저 `npm run health-check`를 실행해서 자동 진단을 받아보세요!