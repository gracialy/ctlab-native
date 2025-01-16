export type Cell = 'wall' | 'empty' | 'pellet' | 'ghost' | 'pacman';
export type Command = 'left' | 'right' | 'up' | 'down';
export type Position = { x: number; y: number };

export type GameState = {
  map: Cell[][];
  pacman: Position;
  ghosts: Position[];
  lives: number;
  score: number;
  iterations: number;
  commands: Command[];
};

export type CellStyle = {
    backgroundColor: string;
};

export type CellStyleMap = Record<Cell, CellStyle>;

export type SavedGame = {
    id: string;
    save_name: string;
    saved_at: string;
};
  