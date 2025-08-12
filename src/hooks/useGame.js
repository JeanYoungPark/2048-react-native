import { useState, useEffect, useCallback } from 'react';
import { GameGrid, GameManager } from '../utils/GameEngine';
import StorageManager from '../utils/Storage';

export const useGame = () => {
  const [grid, setGrid] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [gameManager] = useState(new GameManager());

  // Initialize game
  const initializeGame = useCallback(async () => {
    try {
      const savedBestScore = await StorageManager.getBestScore();
      setBestScore(savedBestScore);

      const savedState = await StorageManager.getGameState();
      
      if (savedState) {
        // Restore saved game
        const restoredGrid = new GameGrid(4);
        
        // Reconstruct grid from saved state
        savedState.grid.forEach((row, x) => {
          row.forEach((cellData, y) => {
            if (cellData) {
              const tile = {
                x,
                y,
                value: cellData.value,
                id: cellData.id || Math.random().toString(36).substr(2, 9)
              };
              restoredGrid.cells[x][y] = tile;
            }
          });
        });
        
        setGrid(restoredGrid);
        setScore(savedState.score || 0);
        setWon(savedState.won || false);
        setOver(savedState.over || false);
        setKeepPlaying(savedState.keepPlaying || false);
      } else {
        // Start new game
        const newGrid = gameManager.setup();
        setGrid(newGrid);
        setScore(0);
        setWon(false);
        setOver(false);
        setKeepPlaying(false);
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      // Fallback to new game
      const newGrid = gameManager.setup();
      setGrid(newGrid);
    }
  }, [gameManager]);

  // Save game state
  const saveGameState = useCallback(async (currentGrid, currentScore, currentWon, currentOver, currentKeepPlaying) => {
    try {
      const gameState = {
        grid: currentGrid.cells.map(row => 
          row.map(tile => tile ? {
            value: tile.value,
            id: tile.id
          } : null)
        ),
        score: currentScore,
        won: currentWon,
        over: currentOver,
        keepPlaying: currentKeepPlaying
      };
      
      await StorageManager.setGameState(gameState);
      
      // Update best score if needed
      if (currentScore > bestScore) {
        setBestScore(currentScore);
        await StorageManager.setBestScore(currentScore);
      }
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }, [bestScore]);

  // Move tiles
  const move = useCallback((direction) => {
    if (!grid || over || (won && !keepPlaying)) return false;

    const newGrid = new GameGrid(4);
    // Deep copy the grid
    newGrid.cells = grid.cells.map(row => [...row]);
    
    const result = gameManager.move(newGrid, direction);
    
    if (result.moved) {
      gameManager.addRandomTile(newGrid);
      
      const newScore = score + result.score;
      const newWon = won || result.won;
      const newOver = !gameManager.movesAvailable(newGrid);
      
      setGrid(newGrid);
      setScore(newScore);
      setWon(newWon);
      setOver(newOver);
      
      // Save state
      saveGameState(newGrid, newScore, newWon, newOver, keepPlaying);
      
      return true;
    }
    
    return false;
  }, [grid, score, won, over, keepPlaying, gameManager, saveGameState]);

  // Restart game
  const restart = useCallback(async () => {
    try {
      await StorageManager.clearGameState();
      const newGrid = gameManager.setup();
      
      setGrid(newGrid);
      setScore(0);
      setWon(false);
      setOver(false);
      setKeepPlaying(false);
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  }, [gameManager]);

  // Continue playing after winning
  const continueGame = useCallback(() => {
    setKeepPlaying(true);
    if (grid) {
      saveGameState(grid, score, won, over, true);
    }
  }, [grid, score, won, over, saveGameState]);

  // Get all tiles for rendering
  const getTiles = useCallback(() => {
    if (!grid) return [];
    
    const tiles = [];
    grid.eachCell((x, y, tile) => {
      if (tile) {
        tiles.push(tile);
      }
    });
    return tiles;
  }, [grid]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    grid,
    score,
    bestScore,
    won,
    over,
    keepPlaying,
    tiles: getTiles(),
    move,
    restart,
    continueGame,
    isGameTerminated: over || (won && !keepPlaying)
  };
};