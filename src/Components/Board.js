import "../index.css";
import Square from "./Square";
import React from "react";

const Board = (props) => {
  let board = [];

  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        status={
          props.winningLine
            ? props.winningLine.includes(i)
              ? "winning-square"
              : ""
            : ""
        }
        onClick={() => props.onClick(i)}
      />
    );
  };

  for (let i = 0; i < props.size; i++) {
    let row = [];
    for (let j = 0; j < props.size; j++) {
      row.push(renderSquare(i * props.size + j));
    }
    board.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return <div>{board}</div>;
};

export default Board;
