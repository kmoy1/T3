import React, { useState } from "react";
import { BOARD_SIZE } from "./Constants";

function Square({value, onSquareClick}) {
	return (
	<button className="square" onClick={onSquareClick}>
		{value}
	</button>
	);
}

// Squares = position before X (or O) makes its move.
function Board({ xIsNext, squares, onPlay }) {  
	function handleClick(i) {
		if (squares[i] || calculateWinner(squares)) {
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

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}
	let board = [];
	for (let i = 0; i < BOARD_SIZE; i++) {
		let boardRow = [];
		for (let j = i * BOARD_SIZE; j < (i * BOARD_SIZE) + BOARD_SIZE; j++) {
			boardRow.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)}/>)
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
			description = 'Go to move #' + move;
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
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>{movesList}</ol>
			</div>
			<div className="game-move-number-display">
				You are at move # {currentMove}.
			</div>
			<button onClick={() => {setMoveListAsc(!moveListAsc)}}>Change Move Order</button>
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
			return squares[a];
		}
	}
	return null;
}