import React, { useState } from 'react';
import { Chessboard } from '../components/Chessboard';
import { type Square, type GameState } from '../types';

interface MoveHistoryEntry {
    from: Square;
    to: Square;
    notation: string;
    gameState: GameState;
    moveNumber: number;
}

function App() {
    const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
    const [currentPosition, setCurrentPosition] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [viewingHistoryIndex, setViewingHistoryIndex] = useState<number>(-1);

    const handleMove = (from: Square, to: Square, moveNotation: string, gameState: GameState) => {
        const moveNumber = Math.floor(moveHistory.length / 2) + 1;
        
        const newMove: MoveHistoryEntry = {
            from,
            to,
            notation: moveNotation,
            gameState,
            moveNumber
        };

        const newHistory = [...moveHistory, newMove];
        setMoveHistory(newHistory);
        setCurrentPosition(gameState.fen);
        setViewingHistoryIndex(-1);
    };

    const viewPosition = (index: number) => {
        if (index === -1) {
            setCurrentPosition(moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].gameState.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        } else {
            setCurrentPosition(moveHistory[index].gameState.fen);
        }
        setViewingHistoryIndex(index);
    };

    const resetGame = () => {
        setMoveHistory([]);
        setCurrentPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        setViewingHistoryIndex(-1);
    };

    const isViewingHistory = viewingHistoryIndex !== -1;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">React Smart Chessboard - Demo</h1>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tablero */}
                    <div className="flex-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Chessboard 
                                onMove={handleMove}
                                initialFen={currentPosition}
                                disabled={isViewingHistory}
                            />
                            
                            {isViewingHistory && (
                                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
                                    <strong>Modo Vista:</strong> Viendo posición histórica. Los movimientos están deshabilitados.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de historial */}
                    <div className="w-full lg:w-80">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Historial de Movimientos</h2>
                                <button 
                                    onClick={resetGame}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    Reiniciar
                                </button>
                            </div>

                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {moveHistory.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No hay movimientos aún</p>
                                ) : (
                                    <>
                                        {/* Botón para volver a la posición actual */}
                                        <button
                                            onClick={() => viewPosition(-1)}
                                            className={`w-full text-left p-3 rounded transition-colors ${
                                                viewingHistoryIndex === -1 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <strong>Posición actual</strong>
                                        </button>

                                        {/* Lista de movimientos */}
                                        {moveHistory.map((move, index) => (
                                            <button
                                                key={index}
                                                onClick={() => viewPosition(index)}
                                                className={`w-full text-left p-3 rounded transition-colors ${
                                                    viewingHistoryIndex === index 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>
                                                        {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
                                                        {move.notation}
                                                    </span>
                                                    <span className="text-sm">
                                                        {move.gameState.isCheck && '+'} 
                                                        {move.gameState.isCheckmate && '#'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Información del juego */}
                            {moveHistory.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <h3 className="font-semibold mb-2">Estado del juego:</h3>
                                    <div className="text-sm space-y-1">
                                        <div>
                                            <strong>Turno:</strong> {moveHistory[moveHistory.length - 1].gameState.turn === 'w' ? 'Blancas' : 'Negras'}
                                        </div>
                                        {moveHistory[moveHistory.length - 1].gameState.isCheck && (
                                            <div className="text-red-600 font-medium">¡Jaque!</div>
                                        )}
                                        {moveHistory[moveHistory.length - 1].gameState.isCheckmate && (
                                            <div className="text-red-600 font-bold">¡Jaque mate!</div>
                                        )}
                                        {moveHistory[moveHistory.length - 1].gameState.isStalemate && (
                                            <div className="text-orange-600 font-medium">¡Tablas por ahogado!</div>
                                        )}
                                        {moveHistory[moveHistory.length - 1].gameState.isDraw && (
                                            <div className="text-blue-600 font-medium">¡Tablas!</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

