#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * Metro server wrapper for React Native 0.80 with iOS shortcuts
 * This version is compatible with RN 0.80 which doesn't support --interactive flag
 */
function startMetroCompatible() {
  console.clear();
  
  // Display startup message
  console.log(chalk.blue.bold('🚀 Metro Server - React Native 0.80 Compatible'));
  console.log(chalk.gray('━'.repeat(55)));
  console.log(chalk.cyan('Game2048 Native - Metro Bundler with iOS Shortcuts'));
  console.log(chalk.gray('━'.repeat(55)) + '\n');

  // Show shortcuts that will be available
  console.log(chalk.green.bold('📱 Metro Server Shortcuts (when running):'));
  console.log(`${chalk.yellow('› Press i')} ${chalk.gray('→')} ${chalk.white('Open iOS Simulator')}`);
  console.log(`${chalk.yellow('› Press a')} ${chalk.gray('→')} ${chalk.white('Open Android Emulator')}`);
  console.log(`${chalk.yellow('› Press r')} ${chalk.gray('→')} ${chalk.white('Reload the app')}`);
  console.log(`${chalk.yellow('› Press d')} ${chalk.gray('→')} ${chalk.white('Open developer menu')}`);
  console.log(`${chalk.yellow('› Press Ctrl+C')} ${chalk.gray('→')} ${chalk.white('Stop Metro server')}`);
  console.log(chalk.gray('━'.repeat(55)) + '\n');
  
  console.log(chalk.yellow('⏳ Starting Metro bundler...') + '\n');

  // Start Metro server with correct flags for RN 0.80
  const metroProcess = spawn('npx', ['react-native', 'start', '--port', '8082'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: {
      ...process.env,
      // Ensure proper terminal support
      FORCE_COLOR: '3',
      CI: 'false',
      // RN 0.80 specific environment
      REACT_NATIVE_CLI_USE_YARN: 'false',
    },
  });

  let metroStarted = false;

  // Handle Metro output
  metroProcess.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);
    
    // Detect when Metro is ready and show shortcuts again
    if ((output.includes('Welcome to React Native') || 
         output.includes('Metro waiting') || 
         output.includes('Loading dependency graph')) && !metroStarted) {
      metroStarted = true;
      setTimeout(() => {
        console.log(chalk.green.bold('\n✅ Metro Server Ready!'));
        console.log(chalk.cyan('Now you can use the keyboard shortcuts:'));
        console.log(`${chalk.yellow('i')} = iOS, ${chalk.yellow('a')} = Android, ${chalk.yellow('r')} = Reload, ${chalk.yellow('d')} = Dev Menu`);
        console.log(chalk.gray('━'.repeat(55)) + '\n');
      }, 1000);
    }
  });

  metroProcess.stderr.on('data', (data) => {
    const error = data.toString();
    // Filter out known warnings for cleaner output
    if (!error.includes('Unknown option') && !error.includes('Validation Warning')) {
      process.stderr.write(error);
    }
  });

  metroProcess.on('close', (code) => {
    if (code === 0) {
      console.log(chalk.green('\n✅ Metro server stopped successfully'));
    } else {
      console.log(chalk.yellow(`\n⚠️  Metro server stopped with code ${code}`));
    }
  });

  metroProcess.on('error', (error) => {
    console.error(chalk.red('❌ Failed to start Metro server:'), error.message);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down Metro server...'));
    metroProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    metroProcess.kill('SIGTERM');
  });
}

// Start Metro with compatibility mode
startMetroCompatible();