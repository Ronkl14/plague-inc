import { useState, useEffect } from "react";
import socket from "../utils/socket";

const Board = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    socket.on("board", setBoard);
  }, []);

  return (
    <div>
      {board.length === 0
        ? ""
        : board.map((continent) => {
            return (
              <div key={continent.continent}>
                <h2>{continent.continent}</h2>
                {Array.from({ length: continent.countriesNum }, (_, i) => (
                  <div className={`country-container ${i}`} key={i}></div>
                ))}
              </div>
            );
          })}
    </div>
  );
};

export default Board;
