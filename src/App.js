import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

const rowLength = 30;
const columnLength = 30;
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
const emptyBoard = () => {
  const rows = [];
  for (let i = 0; i < rowLength; i++) {
    rows.push(Array.from(Array(columnLength), () => 0));
  }
  return rows;
};

const randomBoard = () => {
  const rows = [];
  for (let i = 0; i < rowLength; i++) {
    rows.push(Array.from(Array(columnLength), () => Math.random() > 0.5 ? 1 : 0));
  }
  return rows;
};
function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [buffer, setBuffer] = useState(emptyBoard);
  const [bufferTwo, setBufferTwo] = useState(emptyBoard);
  const [currentBoard, setCurrentBoard] = useState(emptyBoard);
  const [running, setRunning] = useState(false);
  const [generations, setGenerations] = useState(0);
  const [changesMade, setChangesMade] = useState(false);

  const handleClick = (i, j) => {
    const newBoard = produce(board, boardCopy => {
      boardCopy[i][j] = board[i][j] ? 0 : 1;
    });
    setBoard(newBoard);

    // const newBoard = Array.from(board);

    // newBoard[i][j] = board[i][j] ? 0 : 1;
    // setBoard(newBoard);
  };
  const runningRef = useRef(running);
  const generationsRef = useRef(generations);
  const changesMadeRef = useRef(changesMade)
  const bufferRef = useRef(buffer)
  const bufferTwoRef = useRef(bufferTwo)
  const currentBoardRef = useRef(currentBoard)
  runningRef.current = running;
  changesMadeRef.current = true

  const swap = (a, b) => {
    const temp = a;
    a = b;
    b = temp;
  }
  const runGame = useCallback((buffer, bufferTwo) => {
    if (!runningRef.current) {
      return;
    }
      generationsRef.current += 1;

    changesMadeRef.current = false;

    currentBoardRef.current = board;


    // setBoard((board) => {
      
    //   return produce(board, (newBoard) => {
    //     for (let i = 0; i < rowLength; i++) {
    //       for (let j = 0; j < columnLength; j++) {
    //         let neighbors = 0;
    //         // if(newBoard[i][j + 1] === 1){
    //         //   neighbors += 1
    //         // }
    //         neighborLocations.forEach(([x, y]) => {
    //           const iCheck = i + x;
    //           const jCheck = j + y;
    //           if (
    //             iCheck >= 0 &&
    //             iCheck < rowLength &&
    //             jCheck >= 0 &&
    //             jCheck < columnLength
    //           ) {
    //             neighbors += board[iCheck][jCheck];
    //           }
    //         });
    //         if (neighbors < 2 || neighbors > 3) {
    //           newBoard[i][j] = 0;
    //           console.log("change made 1 ", changesMadeRef.current)
    //         } else if (board[i][j] === 0 && neighbors === 3) {
    //           newBoard[i][j] = 1;
    //           changesMadeRef.current = true;

    //           console.log("change made 2 ", changesMadeRef.current)

    //         }
    //       }
    //     }
    //     console.log("changes made", changesMadeRef.current)
    //     if(changesMadeRef.current === false){
    //       runningRef.current = !running;
    //       return
    //     }
    //   });
    // });


    bufferRef.current = (board) => {
      return produce(board, (newBoard) => {
        for (let i = 0; i < rowLength; i++) {
          for (let j = 0; j < columnLength; j++) {
            let neighbors = 0;
            // if(newBoard[i][j + 1] === 1){
            //   neighbors += 1
            // }
            neighborLocations.forEach(([x, y]) => {
              const iCheck = i + x;
              const jCheck = j + y;
              if (
                iCheck >= 0 &&
                iCheck < rowLength &&
                jCheck >= 0 &&
                jCheck < columnLength
              ) {
                neighbors += board[iCheck][jCheck];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              newBoard[i][j] = 0;
              console.log("change made 1 ", changesMadeRef.current)
            } else if (board[i][j] === 0 && neighbors === 3) {
              newBoard[i][j] = 1;
              changesMadeRef.current = true;

              console.log("change made 2 ", changesMadeRef.current)

            }
          }
        }
        console.log("changes made", changesMadeRef.current)
        if(changesMadeRef.current === false){
          runningRef.current = !running;
          return
        }
      });
    };


    setBoard(bufferRef.current)

    

    setTimeout(runGame, 500, buffer, bufferTwo);
  }, []);

  // console.log("total", board.reduce((a,b) => a+ b,0));
  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runGame();
          }
        }}
      >
        {!running ? "start" : "stop"}
      </button>
      <button
        onClick={() => {
          setBoard(emptyBoard);
          setRunning(!running);
          generationsRef.current = 0;
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          setBoard(randomBoard); 
        }}
      >
        random
      </button>
      <h1> Generations: {generationsRef.current} </h1>

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
                backgroundColor: board[i][j] ? "black" : undefined,
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
