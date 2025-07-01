/**
 * react-smart-chessboard
 * Copyright (c) 2025 [Tu Nombre]
 *
 * This file is part of react-smart-chessboard.
 *
 * react-smart-chessboard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect, useRef, useState } from "react";
import { Chess, type Piece, type Square } from "chess.js";

interface ChessboardProps {
    onMove?: (from: Square, to: Square) => void;
}

const boardRanks = [8, 7, 6, 5, 4, 3, 2, 1];
const boardFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const Chessboard: React.FC<ChessboardProps> = ({ onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(400);
    const [selected, setSelected] = useState<Square | null>(null);
    const [game] = useState(() => new Chess());

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

    const handleClick = (square: Square) => {
        if (selected) {
            const move = game.move({
                from: selected,
                to: square,
                promotion: "q",
            });
            if (move) {
                onMove?.(move.from as Square, move.to as Square);
            }
            setSelected(null);
        } else {
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                setSelected(square);
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

                        return (
                            <div
                                key={square}
                                onClick={() => handleClick(square)}
                                className={`flex items-center justify-center cursor-pointer ${
                                    isDark ? "bg-green-700" : "bg-green-200"
                                } ${isSelected ? "ring-4 ring-yellow-400" : ""}`}
                                style={{
                                    width: size / 8,
                                    height: size / 8,
                                    fontSize: size / 12,
                                }}
                            >
                                {piece ? renderPiece(piece) : null}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

function renderPiece(piece: Piece | null) {
    if (!piece) return null;
    const symbols: Record<string, string> = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
    };
    return <span>{symbols[piece.color === "w" ? piece.type.toUpperCase() : piece.type]}</span>;
}
