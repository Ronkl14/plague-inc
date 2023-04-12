import { useState, useEffect } from "react";
import socket from "../utils/socket";

const Board = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    socket.on("board", setBoard);
  }, []);

  return (
    <div className="game-board">
      {board.length !== 0 &&
        board.map((continent) => {
          return (
            <div key={continent.continent} className="continent-container">
              <h2>{continent.continent}</h2>
              <div className="continent-cards-container">
                {continent.countries.map((country) => (
                  <div className="country-container">{country?.name}</div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Board;
