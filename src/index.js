import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const BOARD_SIZE = 3;

function Square(props) {
  return (
    <button
      className={props.status ? "winning-square" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        status={
          this.props.winningLine
            ? this.props.winningLine.includes(i)
              ? "winning-square"
              : ""
            : ""
        }
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      let row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push(this.renderSquare(i * BOARD_SIZE + j));
      }
      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          latestPos: {
            row: -1,
            col: -1,
          },
          movesLeft: BOARD_SIZE * BOARD_SIZE,
          winnerData: null,
        },
      ],
      sortIsAscending: true, //Ascending by default
      stepNumber: 0,
      xIsNext: true,
      movesLeft: BOARD_SIZE * BOARD_SIZE,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const movesLeft = current.movesLeft;
    const winnerData = calculateWinner(squares);

    if (squares[i] || winnerData) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    const curRow = Math.floor(i / BOARD_SIZE) + 1;
    const curCol = (i % BOARD_SIZE) + 1;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          latestPos: {
            row: curRow,
            col: curCol,
          },
          movesLeft: movesLeft - 1,
          winnerData: calculateWinner(squares),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleSort() {
    let sortOrder = this.state.sortIsAscending;
    this.setState({
      sortIsAscending: !sortOrder,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

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
            className={this.state.stepNumber === move ? "active-move" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (!this.state.sortIsAscending) {
      moves = moves.reverse();
    }

    const winnerData = current.winnerData;
    let status = "";
    if (winnerData) {
      status = "Winner: " + winnerData.winner;
    } else if (current.movesLeft === 0) {
      status = "That's a draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningLine={winnerData ? winnerData.line : ""}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>
            {this.state.sortIsAscending
              ? "Ascending moves"
              : "Descending moves"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
