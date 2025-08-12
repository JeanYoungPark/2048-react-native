#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * Simple Metro server wrapper that ensures iOS simulator shortcut is displayed
 */
function startMetroWithShortcuts() {
  console.clear();
  
  // Display welcome message
  console.log(chalk.blue.bold('🚀 Metro Server - Game2048 Native'));
  console.log(chalk.gray('━'.repeat(50)));
  console.log(chalk.cyan('Starting Metro bundler with interactive shortcuts...'));
  console.log(chalk.gray('━'.repeat(50)) + '\n');

  // Show available shortcuts upfront
  console.log(chalk.green.bold('📱 Available Shortcuts:'));
  console.log(`${chalk.yellow('› Press i')} ${chalk.gray('→')} ${chalk.white('Open iOS Simulator')}`);
  console.log(`${chalk.yellow('› Press a')} ${chalk.gray('→')} ${chalk.white('Open Android Emulator')}`);
  console.log(`${chalk.yellow('› Press r')} ${chalk.gray('→')} ${chalk.white('Reload App')}`);
  console.log(`${chalk.yellow('› Press d')} ${chalk.gray('→')} ${chalk.white('Developer Menu')}`);
  console.log(`${chalk.yellow('› Press q')} ${chalk.gray('→')} ${chalk.white('Quit Metro')}`);
  console.log(chalk.gray('━'.repeat(50)) + '\n');

  // Start Metro with enhanced environment
  const metroProcess = spawn('npx', ['react-native', 'start', '--port', '8082'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      // Force interactive mode
      CI: 'false',
      TERM: process.env.TERM || 'xterm-256color',
      // Ensure proper terminal interaction
      FORCE_COLOR: '3',
      // Metro-specific flags
      REACT_NATIVE_PACKAGER_HOSTNAME: 'localhost',
    },
  });

  // Handle process termination
  metroProcess.on('close', (code) => {
    console.log(chalk.yellow(`\n👋 Metro server stopped with code ${code}`));
  });

  metroProcess.on('error', (error) => {
    console.error(chalk.red('❌ Failed to start Metro server:'), error.message);
    process.exit(1);
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Stopping Metro server...'));
    metroProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    metroProcess.kill('SIGTERM');
  });
}

// Start the Metro server
startMetroWithShortcuts();