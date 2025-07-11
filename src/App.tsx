import React, { useState } from 'react';
import { Chessboard } from './components/Chessboard';
import { type Square } from 'chess.js';
import { type GameState } from './types';

function App() {
    const [moveHistory, setMoveHistory] = useState<string[]>([]);

    const handleMove = (from: Square, to: Square, san: string, gameState: GameState) => {
        setMoveHistory(prev => [...prev, san]);

        // Log del estado del juego
        console.log('Movimiento:', san);
        console.log('Estado del juego:', gameState);

        if (gameState.isCheckmate) {
            alert(`¡Jaque mate! Ganan las ${gameState.turn === 'w' ? 'negras' : 'blancas'}`);
        } else if (gameState.isStalemate) {
            alert('¡Tablas por ahogado!');
        } else if (gameState.isDraw) {
            alert('¡Tablas!');
        } else if (gameState.isCheck) {
            console.log('¡Jaque!');
        }
    };

    const resetGame = () => {
        setMoveHistory([]);
        // Forzar re-render del tablero
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8">Tablero de Ajedrez</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tablero */}
                    <div className="lg:col-span-2">
                        <Chessboard onMove={handleMove} />
                    </div>

                    {/* Panel lateral */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Controles</h2>
                            <button
                                onClick={resetGame}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Nueva Partida
                            </button>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Historial de Movimientos</h2>
                            <div className="max-h-96 overflow-y-auto">
                                {moveHistory.length === 0 ? (
                                    <p className="text-gray-400">No hay movimientos aún</p>
                                ) : (
                                    <div className="space-y-1">
                                        {moveHistory.map((move, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-gray-400">{Math.floor(index / 2) + 1}.</span>
                                                <span className="font-mono">{move}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;