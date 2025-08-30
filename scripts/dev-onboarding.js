#!/usr/bin/env node

/**
 * 🎯 개발자 온보딩 자동화 스크립트
 * 
 * 새로운 개발자가 프로젝트를 빠르게 설정할 수 있도록 도와주는 완전 자동화 도구입니다.
 * 
 * 기능:
 * - 환경 사전 검증 및 문제점 식별
 * - 누락된 도구 자동 설치 안내
 * - 의존성 설치 및 검증
 * - iOS 설정 자동 구성
 * - 첫 번째 빌드 테스트
 * - 문제 발생 시 자동 진단 및 해결 방법 제시
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
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
    return execSync(command, { encoding: 'utf8', ...options });
  } catch (error) {
    return null;
  }
}

class DeveloperOnboarding {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.platform = os.platform();
    this.steps = [];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 단계 추가
   */
  addStep(name, description, action) {
    this.steps.push({ name, description, action, completed: false });
  }

  /**
   * 필수 도구 설치 확인
   */
  checkPrerequisites() {
    log('\n🔍 필수 도구 설치 상태 확인...', 'cyan');
    
    const tools = [
      {
        name: 'Node.js',
        command: 'node --version',
        minVersion: '18.0.0',
        installUrl: 'https://nodejs.org/',
        checker: (version) => {
          const major = parseInt(version.substring(1).split('.')[0]);
          return major >= 18;
        }
      },
      {
        name: 'npm',
        command: 'npm --version',
        minVersion: '8.0.0',
        installUrl: 'Node.js와 함께 자동 설치됨'
      }
    ];

    if (this.platform === 'darwin') {
      tools.push(
        {
          name: 'Xcode',
          command: 'xcode-select -p',
          installUrl: 'Mac App Store에서 설치',
          checker: (output) => output && output.includes('/Developer')
        },
        {
          name: 'CocoaPods',
          command: 'pod --version',
          minVersion: '1.10.0',
          installUrl: 'sudo gem install cocoapods'
        }
      );
    }

    const results = [];
    
    for (const tool of tools) {
      const output = execSafe(tool.command);
      const isInstalled = output !== null;
      const isValidVersion = isInstalled && (!tool.checker || tool.checker(output.trim()));
      
      results.push({
        ...tool,
        installed: isInstalled,
        validVersion: isValidVersion,
        currentVersion: isInstalled ? output.trim() : null
      });

      if (isInstalled && isValidVersion) {
        log(`  ✅ ${tool.name}: ${output.trim()}`, 'green');
      } else if (isInstalled) {
        log(`  ⚠️  ${tool.name}: ${output.trim()} (버전 확인 필요)`, 'yellow');
        this.warnings.push(`${tool.name} 버전이 요구사항을 만족하지 않을 수 있습니다.`);
      } else {
        log(`  ❌ ${tool.name}: 설치되지 않음`, 'red');
        this.errors.push(`${tool.name}이 설치되지 않았습니다. 설치 방법: ${tool.installUrl}`);
      }
    }

    return results;
  }

  /**
   * 프로젝트 의존성 설치
   */
  async installDependencies() {
    log('\n📦 프로젝트 의존성 설치 중...', 'cyan');
    
    try {
      log('  Node.js 의존성 설치 중...', 'blue');
      execSync('npm install', { 
        cwd: this.projectRoot, 
        stdio: 'inherit'
      });
      log('  ✅ Node.js 의존성 설치 완료', 'green');
    } catch (error) {
      log('  ❌ Node.js 의존성 설치 실패', 'red');
      this.errors.push('npm install 실행 중 오류 발생: ' + error.message);
      return false;
    }

    // iOS 의존성 (macOS만)
    if (this.platform === 'darwin') {
      try {
        log('  iOS 의존성 (CocoaPods) 설치 중...', 'blue');
        execSync('pod install', { 
          cwd: path.join(this.projectRoot, 'ios'),
          stdio: 'inherit'
        });
        log('  ✅ iOS 의존성 설치 완료', 'green');
      } catch (error) {
        log('  ❌ iOS 의존성 설치 실패', 'red');
        this.errors.push('pod install 실행 중 오류 발생: ' + error.message);
        return false;
      }
    }

    return true;
  }

  /**
   * 환경 설정
   */
  async setupEnvironment() {
    log('\n⚙️  환경 설정 중...', 'cyan');
    
    try {
      // 환경 설정 스크립트 실행
      execSync('npm run setup-env', { 
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      log('  ✅ 환경 설정 완료', 'green');
      return true;
    } catch (error) {
      log('  ❌ 환경 설정 실패', 'red');
      this.errors.push('환경 설정 중 오류 발생: ' + error.message);
      return false;
    }
  }

  /**
   * 첫 번째 빌드 테스트
   */
  async testFirstBuild() {
    log('\n🏗️  첫 번째 빌드 테스트 중...', 'cyan');
    
    if (this.platform !== 'darwin') {
      log('  ℹ️  iOS 빌드는 macOS에서만 가능합니다.', 'blue');
      return true;
    }

    return new Promise((resolve) => {
      log('  iOS 빌드 시작 (시간이 걸릴 수 있습니다)...', 'blue');
      
      const buildProcess = spawn('npm', ['run', 'ios'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      let output = '';
      let hasError = false;

      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write('.');
      });

      buildProcess.stderr.on('data', (data) => {
        output += data.toString();
        if (data.toString().includes('error') || data.toString().includes('failed')) {
          hasError = true;
        }
      });

      buildProcess.on('close', (code) => {
        console.log(); // 새 줄
        
        if (code === 0 && !hasError) {
          log('  ✅ 첫 번째 빌드 성공!', 'green');
          log('  🎉 앱이 시뮬레이터에서 실행되고 있습니다.', 'green');
          resolve(true);
        } else {
          log('  ❌ 빌드 실패', 'red');
          this.errors.push('첫 번째 빌드에서 오류 발생');
          
          // 일반적인 오류 패턴 분석
          this.analyzeBuildErrors(output);
          resolve(false);
        }
      });

      // 30초 후 타임아웃
      setTimeout(() => {
        buildProcess.kill();
        log('  ⏰ 빌드 시간 초과 (30초)', 'yellow');
        this.warnings.push('빌드 시간이 오래 걸리고 있습니다. 수동으로 확인하세요.');
        resolve(false);
      }, 30000);
    });
  }

  /**
   * 빌드 오류 분석
   */
  analyzeBuildErrors(output) {
    const commonErrors = [
      {
        pattern: /command not found.*node/i,
        solution: 'Node.js 경로 문제입니다. npm run setup-env를 다시 실행하세요.'
      },
      {
        pattern: /xcrun.*error/i,
        solution: 'Xcode Command Line Tools를 설치하세요: xcode-select --install'
      },
      {
        pattern: /pod.*not found/i,
        solution: 'CocoaPods를 설치하세요: sudo gem install cocoapods'
      },
      {
        pattern: /unable to load contents of file list/i,
        solution: 'CocoaPods 의존성을 재설치하세요: cd ios && pod install'
      }
    ];

    for (const error of commonErrors) {
      if (error.pattern.test(output)) {
        this.errors.push(`해결 방법: ${error.solution}`);
      }
    }
  }

  /**
   * 온보딩 결과 요약
   */
  printSummary() {
    log('\n📋 온보딩 요약:', 'cyan');
    
    if (this.errors.length === 0) {
      log('🎉 축하합니다! 개발 환경이 성공적으로 구성되었습니다.', 'green');
      log('\n다음 단계:', 'cyan');
      log('  1. 코드 에디터에서 프로젝트 열기', 'blue');
      log('  2. src/ 폴더에서 소스 코드 살펴보기', 'blue');
      log('  3. 개발 시작하기!', 'blue');
    } else {
      log('⚠️  일부 문제가 발견되었습니다:', 'yellow');
      this.errors.forEach(error => {
        log(`  ❌ ${error}`, 'red');
      });
    }

    if (this.warnings.length > 0) {
      log('\n주의사항:', 'yellow');
      this.warnings.forEach(warning => {
        log(`  ⚠️  ${warning}`, 'yellow');
      });
    }

    log('\n🆘 도움이 필요한 경우:', 'cyan');
    log('  - npm run env-check (환경 재검사)', 'blue');
    log('  - npm run setup-env (환경 재설정)', 'blue');
    log('  - 팀 멤버에게 문의', 'blue');
  }

  /**
   * 메인 온보딩 프로세스
   */
  async start() {
    log('🎯 개발자 온보딩을 시작합니다!', 'bright');
    log('이 과정은 몇 분 정도 소요될 수 있습니다.\n', 'blue');

    // 1. 사전 요구사항 확인
    const prerequisites = this.checkPrerequisites();
    
    // 치명적인 문제가 있으면 중단
    const criticalErrors = this.errors.filter(error => 
      error.includes('Node.js') || error.includes('npm')
    );
    
    if (criticalErrors.length > 0) {
      log('\n🛑 치명적인 문제가 발견되어 온보딩을 중단합니다.', 'red');
      this.printSummary();
      process.exit(1);
    }

    // 2. 의존성 설치
    const dependenciesInstalled = await this.installDependencies();
    if (!dependenciesInstalled) {
      log('\n🛑 의존성 설치에 실패했습니다.', 'red');
      this.printSummary();
      process.exit(1);
    }

    // 3. 환경 설정
    const environmentSetup = await this.setupEnvironment();
    if (!environmentSetup) {
      log('\n⚠️  환경 설정에 문제가 있지만 계속 진행합니다.', 'yellow');
    }

    // 4. 첫 번째 빌드 테스트
    await this.testFirstBuild();

    // 5. 결과 요약
    this.printSummary();

    if (this.errors.length === 0) {
      log('\n🚀 개발 환경 준비 완료! 즐거운 개발하세요!', 'green');
      process.exit(0);
    } else {
      log('\n⚠️  일부 문제가 있지만, 기본적인 설정은 완료되었습니다.', 'yellow');
      process.exit(1);
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const onboarding = new DeveloperOnboarding();
  onboarding.start().catch(error => {
    console.error('❌ 온보딩 중 예상치 못한 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = DeveloperOnboarding;