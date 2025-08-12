import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const gameSize = Math.min(screenWidth * 0.9, 360);
const gridPadding = 15;
const cellGap = 15;
// 정확한 계산: (전체크기 - 패딩*2 - 간격*3) / 4개 셀
const cellSize = (gameSize - gridPadding * 2 - cellGap * 3) / 4;

export const colors = {
  background: '#faf8ef',
  gridBackground: '#bbada0',
  cellBackground: 'rgba(238, 228, 218, 0.35)',
  textPrimary: '#776e65',
  textSecondary: '#f9f6f2',
  button: '#8f7a66',
  
  // Tile colors
  tile2: '#eee4da',
  tile4: '#ede0c8',
  tile8: '#f2b179',
  tile16: '#f59563',
  tile32: '#f67c5f',
  tile64: '#f65e3b',
  tile128: '#edcf72',
  tile256: '#edcc61',
  tile512: '#edc850',
  tile1024: '#edc53f',
  tile2048: '#edc22e',
  tileSuper: '#ff6b6b',
};

export const getTileColor = (value) => {
  switch (value) {
    case 2: return colors.tile2;
    case 4: return colors.tile4;
    case 8: return colors.tile8;
    case 16: return colors.tile16;
    case 32: return colors.tile32;
    case 64: return colors.tile64;
    case 128: return colors.tile128;
    case 256: return colors.tile256;
    case 512: return colors.tile512;
    case 1024: return colors.tile1024;
    case 2048: return colors.tile2048;
    default: return colors.tileSuper;
  }
};

export const getTilePosition = (x, y) => {
  return {
    x: x * (cellSize + cellGap),
    y: y * (cellSize + cellGap),
  };
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  
  scoreContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  
  scoreBox: {
    backgroundColor: colors.gridBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  
  scoreValue: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  
  intro: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  introText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  
  button: {
    backgroundColor: colors.button,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  
  buttonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  gameContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  gridContainer: {
    backgroundColor: colors.gridBackground,
    borderRadius: 10,
    padding: gridPadding,
    width: gameSize,
    height: gameSize,
    position: 'relative',
  },
  
  gridRow: {
    flexDirection: 'row',
    marginBottom: cellGap,
  },
  
  gridCell: {
    width: cellSize,
    height: cellSize,
    backgroundColor: colors.cellBackground,
    borderRadius: 6,
    marginRight: cellGap,
  },
  
  tileContainer: {
    position: 'absolute',
    top: gridPadding,
    left: gridPadding,
    width: gameSize - gridPadding * 2,
    height: gameSize - gridPadding * 2,
  },
  
  tile: {
    position: 'absolute',
    width: cellSize,
    height: cellSize,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top: 0,
    left: 0,
  },
  
  tileText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  
  tileTextWhite: {
    color: colors.textSecondary,
  },
  
  tileTextSmall: {
    fontSize: 22,
  },
  
  tileTextXSmall: {
    fontSize: 18,
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  overlayButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  
  overlayButton: {
    backgroundColor: colors.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  
  overlayButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.button,
  },
  
  overlayButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  overlayButtonTextSecondary: {
    color: colors.textPrimary,
  },
  
  instructions: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  
  instructionsText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
});