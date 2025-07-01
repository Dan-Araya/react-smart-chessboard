import React from "react";
import { Chessboard } from "./components/Chessboard";

const App: React.FC = () => {
    const handleMove = (from: string, to: string) => {
        console.log(`Moved from ${from} to ${to}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Smart Chessboard Demo</h1>
            <Chessboard onMove={handleMove} />
        </div>
    );
};

export default App;
