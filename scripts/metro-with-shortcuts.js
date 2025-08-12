#!/usr/bin/env node

/**
 * Metro server wrapper that enables interactive shortcuts for React Native 0.80.2
 * This bypasses the interactive mode detection and manually handles shortcuts
 */

const { spawn } = require('child_process');
const chalk = require('chalk');

class MetroWithShortcuts {
  constructor() {
    this.metroProcess = null;
    this.isRunning = false;
  }

  start() {
    console.clear();
    this.displayHeader();

    // Start Metro with minimal flags
    this.metroProcess = spawn('npx', ['react-native', 'start', '--port', '8082'], {
      stdio: ['pipe', 'inherit', 'inherit'],
      cwd: process.cwd(),
      env: {
        ...process.env,
        CI: 'false',
        FORCE_COLOR: 'true',
        REACT_NATIVE_FORCE_INTERACTIVE: 'true',
      }
    });

    this.isRunning = true;
    this.setupKeyboardListener();

    this.metroProcess.on('close', (code) => {
      this.isRunning = false;
      console.log(chalk.yellow(`\n👋 Metro server exited with code ${code}`));
    });

    this.metroProcess.on('error', (error) => {
      console.error(chalk.red('❌ Error starting Metro:'), error);
      this.isRunning = false;
    });

    // Wait a moment then show shortcuts
    setTimeout(() => {
      this.displayShortcuts();
    }, 3000);
  }

  displayHeader() {
    console.log(chalk.blue.bold('🚀 Game2048 Metro Server with iOS Shortcuts'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(chalk.cyan('Starting Metro bundler...'));
    console.log(chalk.gray('━'.repeat(60)) + '\n');
  }

  displayShortcuts() {
    if (!this.isRunning) return;

    console.log('\n' + chalk.green.bold('📱 Interactive Commands Available:'));
    console.log(`${chalk.yellow('› Press i')} ${chalk.gray('│')} Open iOS simulator`);
    console.log(`${chalk.yellow('› Press a')} ${chalk.gray('│')} Open Android emulator`);
    console.log(`${chalk.yellow('› Press r')} ${chalk.gray('│')} Reload the app`);
    console.log(`${chalk.yellow('› Press d')} ${chalk.gray('│')} Open developer menu`);
    console.log(`${chalk.yellow('› Press q')} ${chalk.gray('│')} Quit Metro server`);
    console.log(chalk.gray('━'.repeat(60)) + '\n');
  }

  setupKeyboardListener() {
    // Enable raw mode for character input
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (key) => {
      if (!this.isRunning) return;

      const input = key.toString().toLowerCase();

      switch (input) {
        case 'i':
          this.runIOSSimulator();
          break;
        case 'a':
          this.runAndroidEmulator();
          break;
        case 'r':
          this.reloadApp();
          break;
        case 'd':
          this.openDevMenu();
          break;
        case 'q':
        case '\u0003': // Ctrl+C
          this.quit();
          break;
        default:
          // Ignore other inputs
          break;
      }
    });

    // Handle process signals
    process.on('SIGINT', () => this.quit());
    process.on('SIGTERM', () => this.quit());
  }

  runIOSSimulator() {
    console.log(chalk.cyan('📱 Opening iOS Simulator...'));
    
    const child = spawn('npx', ['react-native', 'run-ios', '--port', '8082'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('error', (error) => {
      console.error(chalk.red(`❌ Error opening iOS simulator: ${error.message}`));
    });
  }

  runAndroidEmulator() {
    console.log(chalk.green('🤖 Opening Android Emulator...'));
    
    const child = spawn('npx', ['react-native', 'run-android', '--port', '8082'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('error', (error) => {
      console.error(chalk.red(`❌ Error opening Android emulator: ${error.message}`));
    });
  }

  reloadApp() {
    console.log(chalk.yellow('🔄 Reloading app...'));
    // Send reload command to Metro via HTTP
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 8082,
      path: '/reload',
      method: 'POST',
    };

    const req = http.request(options, (res) => {
      console.log(chalk.green('✅ Reload command sent'));
    });

    req.on('error', (error) => {
      console.error(chalk.red('❌ Error sending reload command:', error.message));
    });

    req.end();
  }

  openDevMenu() {
    console.log(chalk.magenta('🛠️  Opening developer menu...'));
    // Send dev menu command to Metro
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 8082,
      path: '/open-debugger',
      method: 'POST',
    };

    const req = http.request(options, (res) => {
      console.log(chalk.green('✅ Dev menu command sent'));
    });

    req.on('error', (error) => {
      console.error(chalk.red('❌ Error opening dev menu:', error.message));
    });

    req.end();
  }

  quit() {
    console.log(chalk.red('\n🛑 Stopping Metro server...'));
    this.isRunning = false;

    if (this.metroProcess) {
      this.metroProcess.kill('SIGTERM');
    }

    // Restore terminal
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
    }

    process.exit(0);
  }
}

// Start the Metro server with shortcuts
const metro = new MetroWithShortcuts();
metro.start();