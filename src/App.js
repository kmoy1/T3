import React, { useState } from "react";
import { Button } from 'react-native';
import { BOARD_SIZE } from "./Constants";

function Square({value, onSquareClick, winningSquare}) {
    if (winningSquare) {
        return <button className="winner-square" onClick={onSquareClick}>{value}</button>
    }
    return <button className="square" onClick={onSquareClick}>{value}</button>
    
}

// Squares = position before X (or O) makes its move.
function Board({ xIsNext, squares, onPlay }) {  
	function handleClick(i) {
		if (squares[i] || (calculateWinner(squares)[0] !== null)) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares);
	}

	let winnerInfo = calculateWinner(squares);
    const winner = winnerInfo[0], winningSquareIndices = winnerInfo[1];
    console.log("WINNER: ", winner);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else if (!squares.includes(null)) { // Squares filled with no winner.
        status = "DRAW."
    } 
    else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}
	let board = [];
	for (let i = 0; i < BOARD_SIZE; i++) {
		let boardRow = [];
		for (let j = i * BOARD_SIZE; j < (i * BOARD_SIZE) + BOARD_SIZE; j++) {
            if (winningSquareIndices && winningSquareIndices.includes(j)) {
                boardRow.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)} winningSquare={true}/>)
            } else {
                boardRow.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)} winningSquare={false}/>)
            }
		}
		board.push(<div className="board-row">{boardRow}</div>);
	}
	return (
		<div>
			<div className="status">{status}</div>
			<div>{board}</div>
		</div>
	);
}

export default function Game() {
	// Constructor, basically.
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const [moveListAsc, setMoveListAsc] = useState(true);

	// Re-rendering starts here.
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

    // nextSquares = position after move is made.
	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}
	function jumpTo(gameMove) {
		setCurrentMove(gameMove);
	}
	const moveNumberList = Array.from({ length: history.length }, (_, index) => index);
	const movesList = (moveListAsc? moveNumberList : [...moveNumberList].reverse()).map((move) => {
		let description;
		if (move > 0) {
			description = 'Move #' + move + ": " + moveNumToPlayer(move) + " on " + convertTo2D(findDiffIndex(history[move], history[move-1]));
		} else {
			description = 'Go to game start';
		}
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board-container">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
            <div class="break"></div>
            <div className="game-info-container">
                <div className="game-info">
                    <ol>{movesList}</ol>
                </div>
                <div className="game-move-number-display">
                    You are at move # {currentMove}.
                </div>
                <Button title="Change Move Order" onPress={() => {setMoveListAsc(!moveListAsc)}} />
            </div>
		</div>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], [a,b,c]];
		}
	}
	return [null, null];
}

// Move 0 = start. 
function moveNumToPlayer(move) {
    return (move % 2 === 0 ? "O" : "X");
}

function convertTo2D(coord) {
    const x = coord % 3;
    const y = Math.floor(coord / 3);
    return `(${x},${y})`
}

// Find differing index between two position arrays.
function findDiffIndex(pos1, pos2) {
    if (pos1.length !== pos2.length) {
        throw new Error("Position arrays need to have the same length.");
    }
    for (let i = 0; i < pos1.length; i++) {
        if (pos1[i] !== pos2[i]) {
          return i;
        }
    }
    return -1; //Shouldn't be here either.
}