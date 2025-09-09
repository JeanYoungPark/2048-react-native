/**
 * 2048 Game for React Native
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';
import Game2048 from './src/components/Game2048';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // 네비게이션 바 높이 감지
      const screen = Dimensions.get('screen');
      const window = Dimensions.get('window');
      
      const navBarHeight = screen.height - window.height;
      const statusHeight = StatusBar.currentHeight || 0;
      
      setNavigationBarHeight(navBarHeight);
      setStatusBarHeight(statusHeight);
      
      console.log('Screen height:', screen.height);
      console.log('Window height:', window.height);
      console.log('Navigation bar height:', navBarHeight);
      console.log('Status bar height:', statusHeight);
    }
  }, []);

  const backgroundStyle = {
    backgroundColor: '#faf8ef',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? Math.max(statusBarHeight, 20) : 20, // 동적 상단 여백
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
        hidden={true}
        translucent={true}
      />
      <Game2048 />
    </View>
  );
}

const styles = StyleSheet.create({});

export default App;
