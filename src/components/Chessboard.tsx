import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { type Piece, type Square } from "chess.js";

interface ChessboardProps {
    onMove?: (from: Square, to: Square) => void;
}

type PromotionPiece = 'q' | 'r' | 'b' | 'n';

const boardRanks = [8, 7, 6, 5, 4, 3, 2, 1];
const boardFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const Chessboard: React.FC<ChessboardProps> = ({ onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(400);
    const [selected, setSelected] = useState<Square | null>(null);
    const [validMoves, setValidMoves] = useState<Square[]>([]);
    const [game, setGame] = useState(() => new Chess());
    const [promotionMove, setPromotionMove] = useState<{from: Square, to: Square} | null>(null);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setSize(Math.floor(width));
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const isPromotionMove = (from: Square, to: Square): boolean => {
        const piece = game.get(from);
        if (!piece || piece.type !== 'p') return false;

        const toRank = parseInt(to[1]);
        return (piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1);
    };

    const executeMove = (from: Square, to: Square, promotion?: PromotionPiece) => {
        try {
            const move = game.move({ from, to, promotion });
            if (move) {
                setGame(new Chess(game.fen()));
                setSelected(null);
                setValidMoves([]);
                onMove?.(move.from as Square, move.to as Square);
                return true;
            }
        } catch {
            // Movimiento inválido
        }
        return false;
    };

    const handlePromotion = (piece: PromotionPiece) => {
        if (promotionMove) {
            executeMove(promotionMove.from, promotionMove.to, piece);
            setPromotionMove(null);
        }
    };

    const cancelPromotion = () => {
        setPromotionMove(null);
        // Mantener la pieza seleccionada para que el usuario pueda intentar otro movimiento
        // setSelected y setValidMoves ya están configurados desde el movimiento anterior
    };

    const handleClick = (square: Square) => {
        // Si hay una pieza seleccionada
        if (selected) {
            // Si hacemos clic en la misma pieza, deseleccionar
            if (selected === square) {
                setSelected(null);
                setValidMoves([]);
                return;
            }

            // Verificar si la casilla de destino tiene una pieza del jugador actual
            const targetPiece = game.get(square);
            if (targetPiece && targetPiece.color === game.turn()) {
                // Seleccionar la nueva pieza
                setSelected(square);
                const moves = game.moves({ square, verbose: true }) as { to: Square }[];
                const targets = moves.map((m) => m.to);
                setValidMoves(targets);
                return;
            }

            // Intentar hacer el movimiento (solo si no es una pieza propia)
            if (isPromotionMove(selected, square)) {
                // Es una promoción, mostrar selector
                setPromotionMove({ from: selected, to: square });
                return;
            }

            // Movimiento normal
            if (executeMove(selected, square)) {
                return;
            }

            // Deseleccionar si hacemos clic en casilla vacía o el movimiento no es válido
            setSelected(null);
            setValidMoves([]);
        } else {
            // No hay pieza seleccionada, intentar seleccionar una
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                setSelected(square);
                const moves = game.moves({ square, verbose: true }) as { to: Square }[];
                const targets = moves.map((m) => m.to);
                setValidMoves(targets);
            }
        }
    };

    return (
        <div ref={containerRef} className="w-full max-w-[min(100%,600px)] mx-auto">
            <div
                className="grid grid-cols-8 border-2 border-gray-700"
                style={{ width: size, height: size }}
            >
                {boardRanks.map((rank, y) =>
                    boardFiles.map((file, x) => {
                        const square = `${file}${rank}` as Square;
                        const piece = game.get(square);
                        const isDark = (x + y) % 2 === 1;
                        const isSelected = square === selected;
                        const isHighlighted = validMoves.includes(square);

                        return (
                            <div
                                key={square}
                                onClick={() => handleClick(square)}
                                className={`relative flex items-center justify-center cursor-pointer ${
                                    isSelected
                                        ? "bg-blue-500"
                                        : isDark
                                            ? "bg-gray-500"
                                            : "bg-gray-200"
                                }`}
                                style={{
                                    width: size / 8,
                                    height: size / 8,
                                    fontSize: size / 12,
                                }}
                            >
                                {piece && renderPiece(piece)}
                                {isHighlighted && (
                                    <div
                                        className="absolute rounded-full bg-blue-500 opacity-60 pointer-events-none"
                                        style={{
                                            width: size / 12,
                                            height: size / 12,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de promoción */}
            {promotionMove && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={cancelPromotion}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4 text-center text-black">
                            Elige una pieza para la promoción
                        </h3>
                        <div className="flex gap-4 justify-center">
                            {(['q', 'r', 'b', 'n'] as PromotionPiece[]).map((pieceType) => {
                                const piece = {
                                    color: game.turn(),
                                    type: pieceType
                                };
                                return (
                                    <button
                                        key={pieceType}
                                        onClick={() => handlePromotion(pieceType)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        style={{ width: 60, height: 60 }}
                                    >
                                        {renderPiece(piece as Piece)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function renderPiece(piece: Piece) {
    const filename = `${piece.color}${piece.type.toUpperCase()}`;
    const src = `/pieces/cburnett/${filename}.svg`;
    return (
        <img
            src={src}
            alt={piece.type}
            draggable={false}
            className="w-full h-full object-contain"
        />
    );
}