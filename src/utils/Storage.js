import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageManager {
  constructor() {
    this.bestScoreKey = '@game2048:bestScore';
    this.gameStateKey = '@game2048:gameState';
  }
  
  async getBestScore() {
    try {
      const value = await AsyncStorage.getItem(this.bestScoreKey);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error getting best score:', error);
      return 0;
    }
  }
  
  async setBestScore(score) {
    try {
      await AsyncStorage.setItem(this.bestScoreKey, score.toString());
    } catch (error) {
      console.error('Error setting best score:', error);
    }
  }
  
  async getGameState() {
    try {
      const value = await AsyncStorage.getItem(this.gameStateKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting game state:', error);
      return null;
    }
  }
  
  async setGameState(gameState) {
    try {
      await AsyncStorage.setItem(this.gameStateKey, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error setting game state:', error);
    }
  }
  
  async clearGameState() {
    try {
      await AsyncStorage.removeItem(this.gameStateKey);
    } catch (error) {
      console.error('Error clearing game state:', error);
    }
  }
}

export default new StorageManager();