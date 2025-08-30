#!/usr/bin/env node

/**
 * 🏥 환경 건강 검사 및 문제 진단 시스템
 * 
 * React Native 개발 환경의 건강 상태를 종합적으로 검사하고
 * 문제 발생 시 자동 진단 및 해결 방법을 제시합니다.
 * 
 * 기능:
 * - 전체 환경 상태 검사
 * - 성능 벤치마크
 * - 일반적인 문제 자동 진단
 * - 해결 방법 자동 제시
 * - 환경 최적화 제안
 * - 상세한 진단 리포트 생성
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// 색상 출력 유틸리티
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execSafe(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
  } catch (error) {
    return { error: error.message, code: error.status };
  }
}

class HealthChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.results = {
      overall: 'unknown',
      checks: [],
      errors: [],
      warnings: [],
      suggestions: []
    };
  }

  /**
   * 검사 결과 추가
   */
  addCheck(name, status, details, solution = null) {
    this.results.checks.push({ name, status, details, solution });
    
    if (status === 'error') {
      this.results.errors.push({ name, details, solution });
    } else if (status === 'warning') {
      this.results.warnings.push({ name, details, solution });
    }
  }

  /**
   * Node.js 환경 검사
   */
  checkNodeEnvironment() {
    log('🔍 Node.js 환경 검사 중...', 'cyan');
    
    // Node.js 버전 확인
    const nodeVersion = execSafe('node --version');
    if (nodeVersion.error) {
      this.addCheck('Node.js', 'error', 'Node.js를 찾을 수 없습니다', 
        'https://nodejs.org에서 Node.js를 설치하세요');
      return;
    }

    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
    if (majorVersion < 18) {
      this.addCheck('Node.js 버전', 'error', 
        `Node.js ${nodeVersion.trim()}는 너무 낮습니다`, 
        'Node.js 18 이상으로 업그레이드하세요');
    } else {
      this.addCheck('Node.js 버전', 'pass', `${nodeVersion.trim()} ✓`);
    }

    // npm 버전 확인
    const npmVersion = execSafe('npm --version');
    if (npmVersion.error) {
      this.addCheck('npm', 'error', 'npm을 찾을 수 없습니다', 
        'Node.js와 함께 npm을 재설치하세요');
    } else {
      this.addCheck('npm', 'pass', `v${npmVersion.trim()} ✓`);
    }

    // Node.js 경로 확인
    const nodePath = execSafe('which node');
    if (nodePath && !nodePath.error) {
      this.addCheck('Node.js 경로', 'pass', nodePath.trim());
      
      // nvm 사용 여부 확인
      if (nodePath.includes('.nvm')) {
        this.results.suggestions.push('nvm을 사용 중입니다. 버전 관리에 유리합니다.');
      }
    }
  }

  /**
   * React Native 환경 검사
   */
  checkReactNativeEnvironment() {
    log('⚛️  React Native 환경 검사 중...', 'cyan');
    
    // React Native CLI 확인
    const rnCliVersion = execSafe('npx react-native --version');
    if (rnCliVersion.error) {
      this.addCheck('React Native CLI', 'warning', 
        'React Native CLI에 접근할 수 없습니다',
        'npm install -g @react-native-community/cli');
    } else {
      this.addCheck('React Native CLI', 'pass', 'CLI 접근 가능 ✓');
    }

    // package.json 확인
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      this.addCheck('package.json', 'pass', `React Native ${packageJson.dependencies['react-native']} ✓`);
      
      // 엔진 요구사항 확인
      if (packageJson.engines && packageJson.engines.node) {
        const requiredNode = packageJson.engines.node;
        this.addCheck('Node.js 요구사항', 'info', `요구사항: ${requiredNode}`);
      }
    } else {
      this.addCheck('package.json', 'error', 'package.json 파일을 찾을 수 없습니다');
    }

    // node_modules 확인
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      const stats = fs.statSync(nodeModulesPath);
      this.addCheck('node_modules', 'pass', `설치됨 (${stats.mtime.toLocaleDateString()}) ✓`);
    } else {
      this.addCheck('node_modules', 'error', 'node_modules가 없습니다', 'npm install을 실행하세요');
    }
  }

  /**
   * iOS 환경 검사 (macOS만)
   */
  checkIOSEnvironment() {
    if (os.platform() !== 'darwin') {
      this.addCheck('iOS 환경', 'skip', 'macOS가 아니므로 건너뜀');
      return;
    }

    log('🍎 iOS 개발 환경 검사 중...', 'cyan');

    // Xcode 설치 확인
    const xcodePath = execSafe('xcode-select -p');
    if (xcodePath.error) {
      this.addCheck('Xcode', 'error', 'Xcode가 설치되지 않았습니다', 
        'Mac App Store에서 Xcode를 설치하세요');
    } else {
      this.addCheck('Xcode', 'pass', `설치됨: ${xcodePath.trim()} ✓`);
      
      // Xcode 버전 확인
      const xcodeVersion = execSafe('xcodebuild -version');
      if (xcodeVersion && !xcodeVersion.error) {
        const versionLine = xcodeVersion.split('\n')[0];
        this.addCheck('Xcode 버전', 'pass', versionLine);
      }
    }

    // CocoaPods 확인
    const podVersion = execSafe('pod --version');
    if (podVersion.error) {
      this.addCheck('CocoaPods', 'warning', 'CocoaPods가 설치되지 않았습니다',
        'sudo gem install cocoapods');
    } else {
      this.addCheck('CocoaPods', 'pass', `v${podVersion.trim()} ✓`);
    }

    // iOS 시뮬레이터 확인
    const simulators = execSafe('xcrun simctl list devices | grep "iPhone"');
    if (simulators && !simulators.error) {
      const deviceCount = simulators.split('\n').filter(line => line.includes('iPhone')).length;
      this.addCheck('iOS 시뮬레이터', 'pass', `${deviceCount}개 디바이스 사용 가능 ✓`);
    }

    // .xcode.env.local 확인
    const xcodenvLocalPath = path.join(this.projectRoot, 'ios', '.xcode.env.local');
    if (fs.existsSync(xcodenvLocalPath)) {
      const content = fs.readFileSync(xcodenvLocalPath, 'utf8');
      if (content.includes('$(command -v node)')) {
        this.addCheck('.xcode.env.local', 'pass', '동적 경로 설정됨 ✓');
      } else if (content.includes('export NODE_BINARY=')) {
        this.addCheck('.xcode.env.local', 'warning', '하드코딩된 경로 감지됨', 
          'npm run setup-env를 실행하여 동적 경로로 변경하세요');
      }
    } else {
      this.addCheck('.xcode.env.local', 'error', '환경 파일이 없습니다', 
        'npm run setup-env를 실행하세요');
    }

    // Pods 확인
    const podsPath = path.join(this.projectRoot, 'ios', 'Pods');
    if (fs.existsSync(podsPath)) {
      this.addCheck('iOS Pods', 'pass', '설치됨 ✓');
    } else {
      this.addCheck('iOS Pods', 'error', 'Pods가 설치되지 않았습니다', 
        'cd ios && pod install을 실행하세요');
    }
  }

  /**
   * 성능 벤치마크
   */
  checkPerformance() {
    log('⚡ 성능 벤치마크 실행 중...', 'cyan');

    // 디스크 용량 확인
    try {
      const stats = fs.statSync(this.projectRoot);
      const diskUsage = execSafe(`du -sh "${this.projectRoot}"`);
      if (diskUsage && !diskUsage.error) {
        const size = diskUsage.split('\t')[0];
        this.addCheck('프로젝트 크기', 'info', `${size}`);
      }
    } catch (error) {
      // 무시
    }

    // 메모리 사용량
    const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    const freeMem = Math.round(os.freemem() / 1024 / 1024 / 1024);
    this.addCheck('시스템 메모리', 'info', `${freeMem}GB / ${totalMem}GB 사용 가능`);

    // CPU 정보
    const cpus = os.cpus();
    this.addCheck('CPU', 'info', `${cpus[0].model} (${cpus.length} 코어)`);
  }

  /**
   * 일반적인 문제 진단
   */
  diagnoseCommonIssues() {
    log('🔧 일반적인 문제 진단 중...', 'cyan');

    // Metro 포트 확인
    const metroPort = execSafe('lsof -ti:8082');
    if (metroPort && !metroPort.error) {
      this.addCheck('Metro 포트 8082', 'warning', 'Metro 서버가 실행 중입니다', 
        '새로운 Metro 서버를 시작하기 전에 기존 서버를 종료하세요');
    } else {
      this.addCheck('Metro 포트 8082', 'pass', '포트 사용 가능 ✓');
    }

    // .gitignore 확인
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (gitignore.includes('ios/.xcode.env.local')) {
        this.addCheck('.gitignore', 'pass', '환경 파일이 올바르게 제외됨 ✓');
      } else {
        this.addCheck('.gitignore', 'warning', 'ios/.xcode.env.local이 gitignore에 없습니다',
          '.gitignore에 ios/.xcode.env.local을 추가하세요');
      }
    }

    // 환경 변수 확인
    if (process.env.NODE_ENV) {
      this.addCheck('NODE_ENV', 'info', `${process.env.NODE_ENV}`);
    }
  }

  /**
   * 전체 건강 점수 계산
   */
  calculateOverallHealth() {
    const total = this.results.checks.length;
    const passed = this.results.checks.filter(c => c.status === 'pass').length;
    const errors = this.results.checks.filter(c => c.status === 'error').length;
    
    if (errors > 0) {
      this.results.overall = 'poor';
    } else if (passed / total > 0.8) {
      this.results.overall = 'excellent';
    } else if (passed / total > 0.6) {
      this.results.overall = 'good';
    } else {
      this.results.overall = 'fair';
    }

    return {
      score: Math.round((passed / total) * 100),
      grade: this.results.overall
    };
  }

  /**
   * 결과 출력
   */
  printResults() {
    const health = this.calculateOverallHealth();
    
    log('\n📊 건강 검사 결과:', 'cyan');
    
    // 전체 점수 출력
    const scoreColor = health.score >= 80 ? 'green' : health.score >= 60 ? 'yellow' : 'red';
    log(`전체 점수: ${health.score}/100 (${health.grade.toUpperCase()})`, scoreColor);

    // 상세 결과
    log('\n상세 결과:', 'blue');
    this.results.checks.forEach(check => {
      let icon = '✅';
      let color = 'green';
      
      if (check.status === 'error') {
        icon = '❌';
        color = 'red';
      } else if (check.status === 'warning') {
        icon = '⚠️';
        color = 'yellow';
      } else if (check.status === 'info') {
        icon = 'ℹ️';
        color = 'blue';
      } else if (check.status === 'skip') {
        icon = '⏭️';
        color = 'cyan';
      }

      log(`  ${icon} ${check.name}: ${check.details}`, color);
    });

    // 오류 및 해결 방법
    if (this.results.errors.length > 0) {
      log('\n🚨 발견된 문제점 및 해결 방법:', 'red');
      this.results.errors.forEach((error, index) => {
        log(`${index + 1}. ${error.name}: ${error.details}`, 'red');
        if (error.solution) {
          log(`   해결 방법: ${error.solution}`, 'yellow');
        }
      });
    }

    // 경고사항
    if (this.results.warnings.length > 0) {
      log('\n⚠️ 주의사항:', 'yellow');
      this.results.warnings.forEach((warning, index) => {
        log(`${index + 1}. ${warning.name}: ${warning.details}`, 'yellow');
        if (warning.solution) {
          log(`   개선 방법: ${warning.solution}`, 'blue');
        }
      });
    }

    // 제안사항
    if (this.results.suggestions.length > 0) {
      log('\n💡 개선 제안:', 'cyan');
      this.results.suggestions.forEach((suggestion, index) => {
        log(`${index + 1}. ${suggestion}`, 'cyan');
      });
    }

    // 다음 단계 안내
    log('\n🎯 권장 다음 단계:', 'green');
    if (this.results.errors.length > 0) {
      log('  1. 위의 오류를 먼저 해결하세요', 'yellow');
      log('  2. npm run health-check를 다시 실행하세요', 'blue');
    } else {
      log('  1. npm run ios (앱 실행)', 'green');
      log('  2. 개발 시작하기!', 'green');
    }
  }

  /**
   * 메인 검사 실행
   */
  async run() {
    log('🏥 React Native 환경 건강 검사를 시작합니다...', 'bright');
    
    this.checkNodeEnvironment();
    this.checkReactNativeEnvironment();
    this.checkIOSEnvironment();
    this.checkPerformance();
    this.diagnoseCommonIssues();
    
    this.printResults();

    const health = this.calculateOverallHealth();
    process.exit(health.score >= 60 ? 0 : 1);
  }
}

// 스크립트 실행
if (require.main === module) {
  const checker = new HealthChecker();
  checker.run().catch(error => {
    console.error('❌ 건강 검사 중 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = HealthChecker;