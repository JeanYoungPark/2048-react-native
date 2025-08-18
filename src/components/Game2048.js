import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { useGame } from '../hooks/useGame';
import TileComponent from './TileComponent';
import AdBanner from './AdBanner';
import { styles } from '../styles/GameStyles';

const Game2048 = () => {
  const {
    score,
    bestScore,
    won,
    over,
    keepPlaying,
    tiles,
    move,
    restart,
    continueGame,
    isGameTerminated,
  } = useGame();

  // AdMob 초기화
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // AdMob 초기화 완료
      })
      .catch(error => {
        // AdMob 초기화 실패 처리
      });
  }, []);

  // 단순한 재시작 함수
  const handleRestart = () => {
    restart();
  };

  // Gesture handling for swipes
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: () => {},
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Minimum swipe distance
      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          // Horizontal swipe
          move(dx > 0 ? 1 : 3);
        } else {
          // Vertical swipe
          move(dy > 0 ? 2 : 0); // Down : Up
        }
      }
    },
    onPanResponderTerminationRequest: () => true,
  });

  const renderGrid = () => {
    const rows = [];
    for (let y = 0; y < 4; y++) {
      const cells = [];
      for (let x = 0; x < 4; x++) {
        cells.push(
          <View 
            key={`${x}-${y}`} 
            style={[
              styles.gridCell, 
              x === 3 && { marginRight: 0 }
            ]} 
          />
        );
      }
      rows.push(
        <View key={String(y)} style={[
          styles.gridRow,
          y === 3 && { marginBottom: 0 }
        ]}>
          {cells}
        </View>
      );
    }
    return rows;
  };

  const renderTiles = () => {
    if (!tiles) return [];
    
    return tiles.map(tile => (
      <TileComponent key={tile.id} tile={tile} />
    ));
  };

  const renderOverlay = () => {
    if (!isGameTerminated && !won) return null;

    let messageText = '';
    if (won && !keepPlaying) {
      messageText = '축하합니다!\n2048을 달성했습니다!';
    } else if (over) {
      messageText = '게임 오버!';
    }

    if (!messageText) return null;

    // 단순한 단일 Text 컴포넌트로 변경
    return (
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          {messageText}
        </Text>
        <View 
          style={styles.overlayButtons}>
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={handleRestart}
            activeOpacity={0.7}>
            <Text style={styles.overlayButtonText}>
다시 시도
            </Text>
          </TouchableOpacity>
          {won && !over && (
            <TouchableOpacity
              style={[styles.overlayButton, styles.overlayButtonSecondary]}
              onPress={continueGame}
              activeOpacity={0.7}>
              <Text style={[styles.overlayButtonText, styles.overlayButtonTextSecondary]}>
계속하기
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>2048</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>점수</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>최고점</Text>
              <Text style={styles.scoreValue}>{bestScore}</Text>
            </View>
          </View>
        </View>
        
        {/* 중앙 게임 영역 */}
        <View style={styles.gameArea}>
        
      <View style={styles.intro}>
        <Text style={styles.introText}>
스와이프하여 타일을 이동시키세요.{'\n'}같은 숫자의 타일이 만나면 합쳐집니다!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRestart}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>새 게임</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameContainer}>
        <View
          style={styles.gridContainer}
          {...panResponder.panHandlers}>
          
          {renderGrid()}
          
          <View 
            style={styles.tileContainer}>
            {renderTiles()}
          </View>
          
          {renderOverlay()}
        </View>
      </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
방법: 스와이프로 타일을 이동하세요.{'\n'}두 개의 같은 숫자 타일이 만나면 하나로 합쳐집니다!
          </Text>
        </View>
        
        
        </View>
        
      </View>
      
      {/* 화면 하단 고정 배너 광고 */}
      <View style={styles.fixedAdContainer}>
        <AdBanner />
      </View>
    </SafeAreaView>
  );
};

export default Game2048;