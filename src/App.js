import React, { useState, useCallback, useRef, useEffect } from "react";
import produce from "immer";
import "./App.css";

const neighborLocations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
];

function App() {
  const [rowLength, setRowLength] = useState(30);
  const [columnLength, setColumnLength] = useState(30);

  const randomBoard = () => {
    const rows = [];
    for (let i = 0; i < rowLength; i++) {
      rows.push(
        Array.from(Array(columnLength), () => (Math.random() > 0.5 ? 1 : 0))
      );
    }
    return rows;
  };

  const emptyBoard = (rowLength = 30, columnLength = 30) => {
    setRowLength(rowLength);
    setColumnLength(columnLength);
    console.log("row", rowLength);
    console.log("column", columnLength);
    const rows = [];
    for (let i = 0; i < rowLength; i++) {
      rows.push(Array.from(Array(columnLength), () => 0));
    }
    return rows;
  };
  const [board, setBoard] = useState(emptyBoard);
  const [buffer, setBuffer] = useState(emptyBoard);
  const [bufferTwo, setBufferTwo] = useState(emptyBoard);
  const [currentBoard, setCurrentBoard] = useState(emptyBoard);
  const [running, setRunning] = useState(false);
  const [generations, setGenerations] = useState(0);
  const [changesMade, setChangesMade] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const handleClick = (i, j) => {
    const newBoard = produce(board, (boardCopy) => {
      boardCopy[i][j] = board[i][j] ? 0 : 1;
    });
    setBoard(newBoard);

    // const newBoard = Array.from(board);

    // newBoard[i][j] = board[i][j] ? 0 : 1;
    // setBoard(newBoard);
  };
  const runningRef = useRef(running);
  const generationsRef = useRef(generations);
  const changesMadeRef = useRef(changesMade);
  const bufferRef = useRef(buffer);
  const bufferTwoRef = useRef(bufferTwo);
  const currentBoardRef = useRef(currentBoard);
  const speedRef = useRef(speed);
  runningRef.current = running;
  changesMadeRef.current = true;
  const rowLengthRef = useRef(rowLength);
  const columnLengthRef = useRef(columnLength);

  rowLengthRef.current = rowLength;
  columnLengthRef.current = columnLength;

  // const updateBoard = (row, col) => {
  //   rowLength = row
  //   columnLength = col
  //   emptyBoard(rowLength, columnLength)
  //   console.log("row", rowLength)

  // }

  const runGame = useCallback((currentStatus, nextStatus) => {
    if (!runningRef.current) {
      return;
    }

    changesMadeRef.current = false;

    let current = currentStatus;
    let next = nextStatus;

    let buffer = (current) => {
      return produce(current, (newBoard) => {
        for (let i = 0; i < rowLengthRef.current; i++) {
          for (let j = 0; j < columnLengthRef.current; j++) {
            let neighbors = 0;
            // if(newBoard[i][j + 1] === 1){
            //   neighbors += 1
            // }
            neighborLocations.forEach(([x, y]) => {
              const iCheck = i + x;
              const jCheck = j + y;
              if (
                iCheck >= 0 &&
                iCheck < rowLengthRef.current &&
                jCheck >= 0 &&
                jCheck < columnLengthRef.current
              ) {
                neighbors += current[iCheck][jCheck];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              newBoard[i][j] = 0;
            } else if (board[i][j] === 0 && neighbors === 3) {
              newBoard[i][j] = 1;
              changesMadeRef.current = true;
            }
          }
        }
        if (changesMadeRef.current === false) {
          runningRef.current = !running;
          return;
        }
      });
    };

    let bufferTwo = (next) => {
      return produce(next, (newBufferTwo) => {
        for (let i = 0; i < rowLengthRef.current; i++) {
          for (let j = 0; j < columnLengthRef.current; j++) {
            let neighbors = 0;
            // if(newBoard[i][j + 1] === 1){
            //   neighbors += 1
            // }
            neighborLocations.forEach(([x, y]) => {
              const iCheck = i + x;
              const jCheck = j + y;
              if (
                iCheck >= 0 &&
                iCheck < rowLengthRef.current &&
                jCheck >= 0 &&
                jCheck < columnLengthRef.current
              ) {
                neighbors += next[iCheck][jCheck];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              newBufferTwo[i][j] = 0;
            } else if (next[i][j] === 0 && neighbors === 3) {
              newBufferTwo[i][j] = 1;
              changesMadeRef.current = true;
            }
          }
        }
        if (changesMadeRef.current === false) {
          runningRef.current = !running;
          return;
        }
      });
    };

    next = bufferTwo;

    // display = bufferRef.current

    generationsRef.current += 1;
    console.log("generation", generationsRef.current);

    setBoard(current);

    // when board is set make next grid current and pass next grid down

    // const temp =

    // bufferRef.current = bufferTwoRef.current

    let temp = current;
    current = next;
    next = current;

    console.log("speed", speedRef.current);

    setTimeout(runGame, speedRef.current, current);
  }, []);

  // console.log("total", board.reduce((a,b) => a+ b,0));
  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            // generationsRef.current += 1;
            runGame(board);
          }
        }}
      >
        {!running ? "start" : "stop"}
      </button>
      <button
        onClick={() => {
          setBoard(emptyBoard(rowLength, columnLength));
          if (running) {
            setRunning(!running);
          }

          generationsRef.current = 0;
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          setBoard(randomBoard(rowLength, columnLength));
          generationsRef.current = 0;

        }}
      >
        random
      </button>
      <button
        onClick={() => {
          speedRef.current *= 2;
          setSpeed(speedRef.current)
        }}
      >
        slower
      </button>
      <button
        onClick={() => {
          if (speedRef.current >= 50) {
            speedRef.current /= 2;
            setSpeed(speedRef.current)
          }
        }}
      >
        fast
      </button>
      <button
        onClick={() => {
          setBoard(emptyBoard(30, 30));
          if (running) {
            setRunning(!running);
          }

          generationsRef.current = 0;
        }}
      >
        small
      </button>
      <button
        onClick={() => {
          setBoard(emptyBoard(50, 50));
          if (running) {
            setRunning(!running);
          }

          generationsRef.current = 0;
        }}
      >
        medium
      </button>
      <button
        onClick={() => {
          setBoard(emptyBoard(75, 75));
          if (running) {
            setRunning(!running);
          }

          generationsRef.current = 0;
        }}
      >
        large
      </button>

      <h1> Generations: {generationsRef.current} </h1>
      <h1> Speed: {speed / 1000} sec </h1>

      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnLength}, 20px)`,
        }}
      >
        {board.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                if (!running) {
                  handleClick(i, j);
                }
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: board[i][j] ? "black" : "red",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
