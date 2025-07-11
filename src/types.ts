import { type Square } from "chess.js";

export type PromotionPiece = 'q' | 'r' | 'b' | 'n';

export interface GameState {
    fen: string;
    turn: 'w' | 'b';
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
}

export interface ChessboardProps {
    onMove?: (from: Square, to: Square, san: string, gameState: GameState) => void;
    initialFen?: string;
    disabled?: boolean;
}