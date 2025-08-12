#!/usr/bin/env node

const { spawn } = require('child_process');
const { createTerminalUI } = require('@react-native-community/cli');
const chalk = require('chalk');

/**
 * Custom Metro server with iOS simulator shortcuts
 * Ensures shortcuts are properly displayed and functional
 */
class MetroServerWithShortcuts {
  constructor() {
    this.metroProcess = null;
    this.isRunning = false;
    this.setupTerminalUI();
  }

  setupTerminalUI() {
    // Enable raw mode for better terminal interaction
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    // Handle keyboard input
    process.stdin.on('data', this.handleInput.bind(this));
    
    // Handle process termination
    process.on('SIGINT', this.cleanup.bind(this));
    process.on('SIGTERM', this.cleanup.bind(this));
  }

  async start() {
    console.clear();
    this.displayWelcomeMessage();
    
    // Start Metro bundler
    this.metroProcess = spawn('npx', ['react-native', 'start', '--port', '8082'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    this.isRunning = true;

    // Handle Metro output
    this.metroProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      
      // Show shortcuts when Metro is ready
      if (output.includes('Metro waiting') || output.includes('Welcome to React Native')) {
        this.displayShortcuts();
      }
    });

    this.metroProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    this.metroProcess.on('close', (code) => {
      console.log(`Metro server exited with code ${code}`);
      this.isRunning = false;
    });

    // Display shortcuts immediately
    setTimeout(() => {
      this.displayShortcuts();
    }, 2000);
  }

  displayWelcomeMessage() {
    console.log(chalk.blue.bold('🚀 Starting Metro Server with iOS Simulator Shortcuts'));
    console.log(chalk.gray('━'.repeat(60)));
  }

  displayShortcuts() {
    if (!this.isRunning) return;
    
    console.log('\n' + chalk.blue.bold('Interactive commands:'));
    console.log(`${chalk.green('› Press i')} ${chalk.gray('│')} open iOS simulator`);
    console.log(`${chalk.green('› Press a')} ${chalk.gray('│')} open Android emulator`);
    console.log(`${chalk.green('› Press r')} ${chalk.gray('│')} reload the app`);
    console.log(`${chalk.green('› Press d')} ${chalk.gray('│')} open developer menu`);
    console.log(`${chalk.green('› Press j')} ${chalk.gray('│')} open debugger`);
    console.log(`${chalk.green('› Press c')} ${chalk.gray('│')} clear cache and reload`);
    console.log(`${chalk.green('› Press q')} ${chalk.gray('│')} quit Metro server`);
    console.log(chalk.gray('━'.repeat(60)) + '\n');
  }

  async handleInput(key) {
    if (!this.isRunning) return;
    
    const input = key.toString().trim().toLowerCase();
    
    switch (input) {
      case 'i':
        console.log(chalk.cyan('📱 Opening iOS Simulator...'));
        this.runCommand('npx', ['react-native', 'run-ios', '--port', '8082']);
        break;
        
      case 'a':
        console.log(chalk.green('🤖 Opening Android Emulator...'));
        this.runCommand('npx', ['react-native', 'run-android', '--port', '8082']);
        break;
        
      case 'r':
        console.log(chalk.yellow('🔄 Reloading app...'));
        // Send reload command to Metro
        this.sendMetroCommand('reload');
        break;
        
      case 'd':
        console.log(chalk.magenta('🛠️  Opening developer menu...'));
        this.sendMetroCommand('devMenu');
        break;
        
      case 'j':
        console.log(chalk.blue('🐛 Opening debugger...'));
        this.sendMetroCommand('debugger');
        break;
        
      case 'c':
        console.log(chalk.red('🧹 Clearing cache and reloading...'));
        this.runCommand('npx', ['react-native', 'start', '--reset-cache', '--port', '8082']);
        break;
        
      case 'q':
      case '\u0003': // Ctrl+C
        console.log(chalk.red('👋 Stopping Metro server...'));
        this.cleanup();
        break;
        
      case '\r':
      case '\n':
        // Ignore enter key
        break;
        
      default:
        if (input.length === 1) {
          console.log(chalk.gray(`Unknown command: ${input}`));
          this.displayShortcuts();
        }
        break;
    }
  }

  runCommand(command, args) {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    child.on('error', (error) => {
      console.error(chalk.red(`Error running ${command}: ${error.message}`));
    });
  }

  sendMetroCommand(command) {
    // Send command to Metro bundler via HTTP
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 8082,
      path: `/${command}`,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      // Command sent successfully
    });

    req.on('error', (error) => {
      console.error(chalk.red(`Error sending command to Metro: ${error.message}`));
    });

    req.end();
  }

  cleanup() {
    this.isRunning = false;
    
    if (this.metroProcess) {
      this.metroProcess.kill('SIGTERM');
    }
    
    // Restore terminal
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
    }
    
    console.log(chalk.yellow('\n👋 Metro server stopped'));
    process.exit(0);
  }
}

// Start the enhanced Metro server
const metroServer = new MetroServerWithShortcuts();
metroServer.start().catch((error) => {
  console.error(chalk.red('Error starting Metro server:', error));
  process.exit(1);
});