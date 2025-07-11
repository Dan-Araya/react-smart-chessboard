import { type Square } from 'chess.js';

export interface GameState {
    fen: string;
    turn: 'w' | 'b';
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
}

export interface ChessboardProps {
    onMove?: (from: Square, to: Square, moveNotation: string, gameState: GameState) => void;
    initialFen?: string;
    disabled?: boolean;
    className?: string;
    pieceTheme?: 'cburnett' | 'merida' | 'alpha' | 'chess7' | 'chesscom' | 'companion' | 'fantasy' | 'fresca' | 'gioco' | 'governor' | 'horsey' | 'icpieces' | 'kosal' | 'leipzig' | 'letter' | 'libra' | 'maestro' | 'merida' | 'pirouetti' | 'pixel' | 'reillycraig' | 'riohacha' | 'shapes' | 'spatial' | 'staunty' | 'tatiana';
}

export type PromotionPiece = 'q' | 'r' | 'b' | 'n';

export { type Square } from 'chess.js';
