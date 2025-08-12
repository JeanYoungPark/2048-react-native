// 2048 Game Engine for React Native

export class Tile {
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.id = Math.random().toString(36).substr(2, 9);
    this.previousPosition = null;
    this.mergedFrom = null;
  }
  
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }
  
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

export class GameGrid {
  constructor(size = 4) {
    this.size = size;
    this.cells = this.empty();
  }
  
  empty() {
    const cells = [];
    for (let x = 0; x < this.size; x++) {
      const row = cells[x] = [];
      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }
    return cells;
  }
  
  randomAvailableCell() {
    const cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }
  
  availableCells() {
    const cells = [];
    this.eachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x: x, y: y });
      }
    });
    return cells;
  }
  
  eachCell(callback) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }
  
  cellsAvailable() {
    return !!this.availableCells().length;
  }
  
  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    }
    return null;
  }
  
  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  }
  
  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  }
  
  withinBounds(position) {
    return position.x >= 0 && position.x < this.size &&
           position.y >= 0 && position.y < this.size;
  }
}

export class GameManager {
  constructor() {
    this.size = 4;
    this.startTiles = 2;
  }
  
  setup() {
    const grid = new GameGrid(this.size);
    this.addStartTiles(grid);
    return grid;
  }
  
  addStartTiles(grid) {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile(grid);
    }
  }
  
  addRandomTile(grid) {
    if (grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(grid.randomAvailableCell(), value);
      grid.insertTile(tile);
    }
  }
  
  prepareTiles(grid) {
    grid.eachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }
  
  move(grid, direction) {
    const vector = this.getVector(direction);
    const traversals = this.buildTraversals(vector);
    let moved = false;
    let score = 0;
    let won = false;
    
    this.prepareTiles(grid);
    
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const cell = { x: x, y: y };
        const tile = grid.cellContent(cell);
        
        if (tile) {
          const positions = this.findFarthestPosition(cell, vector, grid);
          const next = grid.cellContent(positions.next);
          
          if (next && next.value === tile.value && !next.mergedFrom) {
            const merged = new Tile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next];
            
            grid.insertTile(merged);
            grid.removeTile(tile);
            
            tile.updatePosition(positions.next);
            
            score += merged.value;
            
            if (merged.value === 2048) won = true;
          } else {
            this.moveTile(tile, positions.farthest, grid);
          }
          
          if (!this.positionsEqual(cell, tile)) {
            moved = true;
          }
        }
      });
    });
    
    return { moved, score, won };
  }
  
  getVector(direction) {
    const map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 },  // Right
      2: { x: 0, y: 1 },  // Down
      3: { x: -1, y: 0 }  // Left
    };
    return map[direction];
  }
  
  buildTraversals(vector) {
    const traversals = { x: [], y: [] };
    
    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    
    return traversals;
  }
  
  findFarthestPosition(cell, vector, grid) {
    let previous;
    
    do {
      previous = cell;
      cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (grid.withinBounds(cell) && !grid.cellContent(cell));
    
    return {
      farthest: previous,
      next: cell
    };
  }
  
  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
  
  moveTile(tile, cell, grid) {
    grid.cells[tile.x][tile.y] = null;
    grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }
  
  movesAvailable(grid) {
    return grid.cellsAvailable() || this.tileMatchesAvailable(grid);
  }
  
  tileMatchesAvailable(grid) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = grid.cellContent({ x: x, y: y });
        
        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            const vector = this.getVector(direction);
            const cell = { x: x + vector.x, y: y + vector.y };
            const other = grid.cellContent(cell);
            
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}