import React, { useState } from "react";
import produce from 'immer';
import "./App.css";

const rowLength = 30;
const columnLength = 30;
const emptyBoard = () => {
  const rows = [];
  for (let i = 0; i < rowLength; i++) {
    rows.push(Array.from(Array(columnLength), () => 0));
  }
  return rows;
};
function App() {
  const [board, setBoard] = useState(emptyBoard);

  const handleClick = (i,j) => {

    const newBoard = produce(board, boardCopy => {
      boardCopy[i][j] = board[i][j] ? 0 : 1;
    });
    setBoard(newBoard);

  };

  console.log(board);
  return (
    <div className="App" style= {{display: 'grid', gridTemplateColumns: `repeat(${columnLength}, 20px)`}}>
      {board.map((rows, i) =>
        rows.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick = {()=> handleClick(i,j)}
              // ()=> {
              // const newBoard = produce(board, boardCopy => {
              //   boardCopy[i][j] = board[i][j] ? 0 : 1;
              // });
              // setBoard(newBoard);

            // }
            // }
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
  );
}



export default App;
