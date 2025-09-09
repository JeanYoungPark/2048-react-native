import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { styles, getTileColor, getTilePosition } from '../styles/GameStyles';

const TileComponent = ({ tile }) => {
  if (!tile) return null;

  const scaleAnim = useRef(new Animated.Value(tile.mergedFrom ? 1 : 0)).current;
  
  const initialPosition = getTilePosition(tile.x, tile.y);
  const positionAnim = useRef(new Animated.ValueXY(initialPosition)).current;

  useEffect(() => {
    // Animate tile appearance for new tiles
    if (!tile.previousPosition && !tile.mergedFrom) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }

    // Animate tile movement
    const newPosition = getTilePosition(tile.x, tile.y);
    Animated.timing(positionAnim, {
      toValue: newPosition,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [tile.x, tile.y, scaleAnim, positionAnim]);

  // Animate merge effect
  useEffect(() => {
    if (tile.mergedFrom) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [tile.mergedFrom, scaleAnim]);

  const backgroundColor = getTileColor(tile.value);
  const textColor = tile.value <= 4 ? '#776e65' : '#f9f6f2';
  
  // Determine text size based on tile value
  let textStyle = [styles.tileText];
  if (tile.value >= 1024) {
    textStyle.push(styles.tileTextXSmall);
  } else if (tile.value >= 128) {
    textStyle.push(styles.tileTextSmall);
  }
  
  if (textColor === '#f9f6f2') {
    textStyle.push(styles.tileTextWhite);
  }

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          backgroundColor,
          transform: [
            { scale: scaleAnim },
            { translateX: positionAnim.x },
            { translateY: positionAnim.y }
          ],
        },
      ]}>
      <Text style={[textStyle, { color: textColor }]} allowFontScaling={false}>
        {tile.value}
      </Text>
    </Animated.View>
  );
};

export default TileComponent;