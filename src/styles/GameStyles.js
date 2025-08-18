import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 디자인 상수정리
const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// 게임 보드 크기 최적화
const availableHeight = screenHeight - 200; // 헤더 + 광고 영역 제외
const gameSize = Math.min(screenWidth * 0.85, availableHeight * 0.6, 320);
const gridPadding = SPACING.md;
const cellGap = SPACING.sm;
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.background,
  },
  
  gameArea: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 90, // 하단 광고 영역 확보
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  
  scoreContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  
  scoreBox: {
    backgroundColor: colors.gridBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 75,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  
  introText: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
    opacity: 0.8,
  },
  
  button: {
    backgroundColor: colors.button,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  
  buttonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  gameContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  gridContainer: {
    backgroundColor: colors.gridBackground,
    borderRadius: 12,
    padding: gridPadding,
    width: gameSize,
    height: gameSize,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  gridRow: {
    flexDirection: 'row',
    marginBottom: cellGap,
  },
  
  gridCell: {
    width: cellSize,
    height: cellSize,
    backgroundColor: colors.cellBackground,
    borderRadius: 8,
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
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  instructionsText: {
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  
  privacyLink: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  
  privacyLinkText: {
    fontSize: 11,
    color: colors.textPrimary,
    textAlign: 'center',
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  
  fixedAdContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(187, 173, 160, 0.3)',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  // 개인정보처리방침 화면 스타일
  privacyContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(187, 173, 160, 0.3)',
    backgroundColor: colors.background,
  },
  
  backButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.md,
  },
  
  backButtonText: {
    fontSize: 16,
    color: colors.button,
    fontWeight: '600',
  },
  
  privacyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  
  privacyContent: {
    flex: 1,
  },
  
  privacySection: {
    padding: SPACING.lg,
  },
  
  privacyDate: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  
  privacyIntro: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  
  privacySectionBlock: {
    marginBottom: SPACING.lg,
  },
  
  privacySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  
  privacySubTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  
  privacyText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  
  privacyListItem: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  
  privacyListSubItem: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.lg,
    opacity: 0.8,
  },
  
  privacyFooter: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: 'rgba(187, 173, 160, 0.1)',
    borderRadius: 8,
  },
  
});