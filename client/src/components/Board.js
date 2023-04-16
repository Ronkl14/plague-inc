import { useState, useEffect } from "react";
import socket from "../utils/socket";

const Board = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    socket.on("board", setBoard);
  }, []);

  useEffect(() => {
    console.log(board);
  }, [board]);

  return (
    <div className="game-board">
      {board.length !== 0 &&
        board.map((continent) => {
          return (
            <div key={continent.continent} className="continent-container">
              <h2>{continent.continent}</h2>
              <div className="continent-cards-container">
                {continent.countries.map((country) => {
                  return (
                    <div className="country-container" key={Math.random()}>
                      {country?.name}
                      <div className="cities-container">
                        {country?.control.map((city) => {
                          return (
                            <div
                              key={Math.random()}
                              className={`city ${city?.color}-city`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Board;
