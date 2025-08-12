const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration - Simple setup like StitchCraft
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    port: 8082,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
