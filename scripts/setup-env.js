#!/usr/bin/env node

/**
 * 🚀 React Native 환경 자동 설정 스크립트
 * 
 * 이 스크립트는 개발 환경을 자동으로 감지하고 설정합니다:
 * - Node.js 경로 동적 감지
 * - iOS .xcode.env.local 파일 자동 생성
 * - 환경 검증 및 문제 진단
 * - 크로스 플랫폼 호환성 보장
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// 색상 출력을 위한 유틸리티
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

class EnvironmentSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.iosPath = path.join(this.projectRoot, 'ios');
    this.xcodenvLocalPath = path.join(this.iosPath, '.xcode.env.local');
  }

  /**
   * Node.js 설치 방법 및 경로 감지
   */
  detectNodeInstallation() {
    const detectionMethods = [
      {
        name: 'nvm',
        detector: () => {
          try {
            const nvmDir = process.env.NVM_DIR || path.join(os.homedir(), '.nvm');
            if (fs.existsSync(nvmDir)) {
              const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
              const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
              return {
                method: 'nvm',
                version: nodeVersion,
                path: nodePath,
                nvmDir: nvmDir,
                priority: 1
              };
            }
          } catch (error) {
            return null;
          }
        }
      },
      {
        name: 'brew',
        detector: () => {
          try {
            const brewPrefix = execSync('brew --prefix', { encoding: 'utf8' }).trim();
            const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
            if (nodePath.includes(brewPrefix)) {
              const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
              return {
                method: 'brew',
                version: nodeVersion,
                path: nodePath,
                brewPrefix: brewPrefix,
                priority: 2
              };
            }
          } catch (error) {
            return null;
          }
        }
      },
      {
        name: 'system',
        detector: () => {
          try {
            const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            return {
              method: 'system',
              version: nodeVersion,
              path: nodePath,
              priority: 3
            };
          } catch (error) {
            return null;
          }
        }
      }
    ];

    const installations = detectionMethods
      .map(method => method.detector())
      .filter(result => result !== null)
      .sort((a, b) => a.priority - b.priority);

    return installations[0] || null;
  }

  /**
   * 환경 상태 검증
   */
  validateEnvironment() {
    const issues = [];
    
    // Node.js 설치 확인
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
      
      if (majorVersion < 18) {
        issues.push({
          type: 'error',
          message: `Node.js 버전이 너무 낮습니다: ${nodeVersion}. 최소 v18 이상이 필요합니다.`
        });
      }
    } catch (error) {
      issues.push({
        type: 'error',
        message: 'Node.js가 설치되지 않았거나 PATH에 없습니다.'
      });
    }

    // npm 설치 확인
    try {
      execSync('npm --version', { encoding: 'utf8' });
    } catch (error) {
      issues.push({
        type: 'error',
        message: 'npm이 설치되지 않았거나 사용할 수 없습니다.'
      });
    }

    // CocoaPods 설치 확인 (macOS만)
    if (process.platform === 'darwin') {
      try {
        execSync('pod --version', { encoding: 'utf8' });
      } catch (error) {
        issues.push({
          type: 'warning',
          message: 'CocoaPods가 설치되지 않았습니다. iOS 개발을 위해 설치하세요: sudo gem install cocoapods'
        });
      }
    }

    // Xcode 설치 확인 (macOS만)
    if (process.platform === 'darwin') {
      try {
        execSync('xcode-select -p', { encoding: 'utf8' });
      } catch (error) {
        issues.push({
          type: 'warning',
          message: 'Xcode가 설치되지 않았거나 Command Line Tools가 없습니다.'
        });
      }
    }

    return issues;
  }

  /**
   * .xcode.env.local 파일 생성
   */
  generateXcodeEnvLocal(nodeInstallation) {
    const content = `# 🚀 자동 생성된 환경 설정 파일
# 이 파일은 scripts/setup-env.js에 의해 자동 생성됩니다.
# 수동으로 편집하지 마세요. 대신 'npm run setup-env'를 실행하세요.

# Node.js 설치 정보:
# - 방법: ${nodeInstallation.method}
# - 버전: ${nodeInstallation.version}
# - 경로: ${nodeInstallation.path}
# - 생성 시간: ${new Date().toISOString()}

# 동적 Node.js 경로 (추천 방식)
export NODE_BINARY=$(command -v node)

# 대체 방식 (위 방식이 작동하지 않을 경우 주석 해제)
# export NODE_BINARY="${nodeInstallation.path}"
`;

    // ios 폴더가 없으면 생성
    if (!fs.existsSync(this.iosPath)) {
      fs.mkdirSync(this.iosPath, { recursive: true });
    }

    fs.writeFileSync(this.xcodenvLocalPath, content, 'utf8');
    log(`✅ .xcode.env.local 파일이 생성되었습니다: ${this.xcodenvLocalPath}`, 'green');
  }

  /**
   * 환경 정보 출력
   */
  printEnvironmentInfo(nodeInstallation, issues) {
    log('\n🔍 환경 정보:', 'cyan');
    log(`  OS: ${os.type()} ${os.release()}`, 'blue');
    log(`  Node.js: ${nodeInstallation.version} (${nodeInstallation.method})`, 'blue');
    log(`  경로: ${nodeInstallation.path}`, 'blue');
    
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      log(`  npm: ${npmVersion}`, 'blue');
    } catch (error) {
      log(`  npm: 설치되지 않음`, 'red');
    }

    if (process.platform === 'darwin') {
      try {
        const podVersion = execSync('pod --version', { encoding: 'utf8' }).trim();
        log(`  CocoaPods: ${podVersion}`, 'blue');
      } catch (error) {
        log(`  CocoaPods: 설치되지 않음`, 'yellow');
      }
    }

    // 문제점 출력
    if (issues.length > 0) {
      log('\n⚠️  발견된 문제점:', 'yellow');
      issues.forEach(issue => {
        const color = issue.type === 'error' ? 'red' : 'yellow';
        log(`  ${issue.type.toUpperCase()}: ${issue.message}`, color);
      });
    } else {
      log('\n✅ 환경 검증 완료: 문제없음', 'green');
    }
  }

  /**
   * 메인 설정 프로세스
   */
  async setup() {
    log('🚀 React Native 환경 자동 설정을 시작합니다...', 'bright');
    
    // Node.js 설치 감지
    const nodeInstallation = this.detectNodeInstallation();
    if (!nodeInstallation) {
      log('❌ Node.js를 찾을 수 없습니다. Node.js를 먼저 설치하세요.', 'red');
      process.exit(1);
    }

    log(`✅ Node.js 감지됨: ${nodeInstallation.version} (${nodeInstallation.method})`, 'green');

    // 환경 검증
    const issues = this.validateEnvironment();

    // .xcode.env.local 생성
    this.generateXcodeEnvLocal(nodeInstallation);

    // 환경 정보 출력
    this.printEnvironmentInfo(nodeInstallation, issues);

    log('\n🎉 환경 설정이 완료되었습니다!', 'green');
    log('다음 단계:', 'cyan');
    log('  1. npm install (의존성 설치)', 'blue');
    log('  2. cd ios && pod install (iOS 의존성 설치, macOS만)', 'blue');
    log('  3. npm run ios (iOS 앱 실행)', 'blue');

    // 심각한 문제가 있으면 경고
    const errors = issues.filter(issue => issue.type === 'error');
    if (errors.length > 0) {
      log('\n🚨 심각한 문제가 발견되었습니다. 위의 오류를 먼저 해결하세요.', 'red');
      process.exit(1);
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const setup = new EnvironmentSetup();
  setup.setup().catch(error => {
    console.error('❌ 환경 설정 중 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = EnvironmentSetup;