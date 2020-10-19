import "../index.css";
import Board from "./Board";
import React, { useState } from "react";

const BOARD_SIZE = 3;

const Game = function (props) {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      latestPos: {
        row: -1,
        col: -1,
      },
      movesLeft: BOARD_SIZE * BOARD_SIZE,
      winnerData: null,
    },
  ]);

  const [sortIsAscending, setSortIsAscending] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(0);

  const current = history[stepNumber];

  const handleClick = (i) => {
    const tempHistory = history.slice(0, stepNumber + 1);
    const current = tempHistory[tempHistory.length - 1];
    const squares = current.squares.slice();
    const movesLeft = current.movesLeft;
    const winnerData = calculateWinner(squares);

    if (squares[i] || winnerData) {
      return;
    }

    squares[i] = xIsNext ? "X" : "O";
    const curRow = Math.floor(i / BOARD_SIZE) + 1;
    const curCol = (i % BOARD_SIZE) + 1;

    setHistory(
      tempHistory.concat([
        {
          squares: squares,
          latestPos: {
            row: curRow,
            col: curCol,
          },
          movesLeft: movesLeft - 1,
          winnerData: calculateWinner(squares),
        },
      ])
    );
    setStepNumber(tempHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const toggleSort = (sortOrder) => {
    setSortIsAscending(!sortOrder);
  };

  let moves = history.map((step, move) => {
    const desc = move
      ? "Go to move #" +
        move +
        " at " +
        "(" +
        history[move].latestPos.row +
        "," +
        history[move].latestPos.col +
        ")"
      : "Go to game start";

    return (
      <li key={move}>
        <button
          className={stepNumber === move ? "active-move" : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  if (!sortIsAscending) {
    moves = moves.reverse();
  }

  const winnerData = current.winnerData;
  let status = "";
  if (winnerData) {
    status = "Winner: " + winnerData.winner;
  } else if (current.movesLeft === 0) {
    status = "That's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          size={BOARD_SIZE}
          squares={current.squares}
          winningLine={winnerData ? winnerData.line : ""}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => toggleSort(sortIsAscending)}>
          {sortIsAscending ? "Ascending moves" : "Descending moves"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [...lines[i]],
      };
    }
  }
  return null;
}

export default Game;
