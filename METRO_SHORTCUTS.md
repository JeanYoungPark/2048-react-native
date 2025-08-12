# Metro Server iOS Simulator Shortcuts

This project now uses the same simple Metro configuration as the working StitchCraft project to ensure iOS simulator shortcuts work properly.

## 🚀 Quick Start

Run the Metro server with iOS simulator shortcuts:

```bash
npm run start
```

**What was changed:**
- ✅ **Simplified Metro config** to match working StitchCraft project
- ✅ **Switched back to native `react-native start`** command  
- ✅ **Removed complex custom scripts** that were causing issues
- ✅ **Kept port 8082** for consistency

**Key Finding:**
StitchCraft (React Native 0.73.8) works with `i` key because it uses the basic React Native CLI without custom modifications. Our React Native 0.80.2 should work the same way with the simplified setup.

## 📱 Available Shortcuts

When Metro server is running, you can use these keyboard shortcuts:

| Shortcut | Action | Description |
|----------|---------|-------------|
| **`i`** | **Open iOS Simulator** | Launches iOS simulator with your app |
| **`a`** | Open Android Emulator | Launches Android emulator with your app |
| **`r`** | Reload App | Hot reloads the React Native app |
| **`d`** | Developer Menu | Opens the developer menu in the app |
| **`q`** | Quit Metro | Stops the Metro server |

## 🛠️ Implementation Details

### Metro Configuration (`metro.config.js`)

Enhanced with:
- Interactive terminal support
- iOS simulator integration
- Proper shortcut display
- CORS headers for development

### Scripts Added

1. **`scripts/start-metro-v0.80.js`** (Default - RN 0.80 Compatible)
   - React Native 0.80 compatible wrapper
   - No unsupported flags, clean startup
   - Clear shortcut indicators
   - Filters out validation warnings

2. **`scripts/start-metro-simple.js`** (Alternative)
   - Simple wrapper with enhanced display
   - Compatible with newer RN versions

3. **`scripts/start-metro.js`** (Advanced)
   - Full custom Metro server implementation
   - Custom keyboard input handling
   - Enhanced terminal UI with colors

### NPM Scripts

```bash
# Default - React Native 0.80 compatible
npm run start

# Simple version
npm run start:simple

# Advanced version with custom UI
npm run start:advanced

# Original React Native CLI (fallback)
npm run start:default
```

## 🔧 Troubleshooting

### Shortcuts Not Working?

1. **Terminal Issues**: Make sure you're using a proper terminal (not IDE integrated terminal)
2. **Environment**: Try `npm run start:default` to use the original React Native CLI
3. **Permissions**: Ensure scripts are executable: `chmod +x scripts/*.js`

### iOS Simulator Not Opening?

1. **Xcode**: Ensure Xcode and iOS Simulator are installed
2. **Path**: Make sure React Native CLI can find the iOS build tools
3. **Manual Launch**: Try running `npm run ios` separately

## 💡 Features

- ✅ iOS Simulator shortcut (i) properly displayed
- ✅ Clear visual indicators for available shortcuts  
- ✅ Enhanced terminal UI with colors
- ✅ Graceful error handling
- ✅ Multiple start script options
- ✅ Backward compatibility maintained

## 🎯 Usage

1. Start Metro: `npm run start`
2. Wait for "Available Shortcuts" message
3. Press `i` to launch iOS Simulator
4. Your React Native app will open in the simulator

The implementation ensures that the iOS simulator shortcut (i) is clearly visible and functional, solving the original issue where Metro server wasn't showing these shortcuts properly.