// Componente principal
export { Chessboard } from './components/Chessboard';

// Tipos
export type { 
    ChessboardProps, 
    GameState, 
    PromotionPiece, 
    Square 
} from './types';

// Re-exportar chess.js types que podrían ser útiles
export type { Chess, Piece, Move } from 'chess.js';
