import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PanResponder,
} from 'react-native';
import { useGame } from '../hooks/useGame';
import TileComponent from './TileComponent';
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
          move(dx > 0 ? 1 : 3); // Right : Left
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
              x === 3 && { marginRight: 0 } // Remove margin from last cell in row
            ]} 
          />
        );
      }
      rows.push(
        <View key={y} style={[
          styles.gridRow,
          y === 3 && { marginBottom: 0 } // Remove margin from last row
        ]}>
          {cells}
        </View>
      );
    }
    return rows;
  };

  const renderTiles = () => {
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

    return (
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{messageText}</Text>
        <View style={styles.overlayButtons}>
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={restart}
            activeOpacity={0.7}>
            <Text style={styles.overlayButtonText}>다시 시도</Text>
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
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={false}>
      
      {/* Header */}
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

      {/* Introduction */}
      <View style={styles.intro}>
        <Text style={styles.introText}>
          스와이프하여 타일을 이동시키세요.{'\n'}같은 숫자의 타일이 만나면 합쳐집니다!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={restart}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>새 게임</Text>
        </TouchableOpacity>
      </View>

      {/* Game Board */}
      <View style={styles.gameContainer}>
        <View
          style={styles.gridContainer}
          {...panResponder.panHandlers}>
          
          {/* Static Grid */}
          {renderGrid()}
          
          {/* Tile Container */}
          <View style={styles.tileContainer}>
            {renderTiles()}
          </View>
          
          {/* Game Over/Win Overlay */}
          {renderOverlay()}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          <Text style={{ fontWeight: 'bold' }}>방법:</Text> 스와이프로 타일을 이동하세요.{'\n'}
          두 개의 같은 숫자 타일이 만나면 하나로 합쳐집니다!
        </Text>
      </View>
    </ScrollView>
  );
};

export default Game2048;