import { useState, useEffect } from "react";
import socket from "../utils/socket";
import { useGameGlobalContext } from "../context/GameContext";
import { usePlayerGlobalContext } from "../context/PlayerContext";

const Board = () => {
  const [board, setBoard] = useState([]);
  const [infectivity, setInfectivity] = useState(0);
  const { phase } = useGameGlobalContext();
  const { players, currentPlayer } = usePlayerGlobalContext();

  useEffect(() => {
    socket.on("board", setBoard);
  }, []);

  useEffect(() => {
    setInfectivity(currentPlayer.infectivity);
  }, [currentPlayer]);

  useEffect(() => {
    console.log(board);
  }, [board]);

  function infectCity(e) {
    if (phase === 4) {
      const cityIdx = e.target.classList[2];
      const continentIdx =
        e.target.parentElement.parentElement.parentElement.parentElement
          .classList[1];
      const countryIdx = e.target.parentElement.parentElement.classList[1];
      if (infectivity > 0) {
        socket.emit("infectCity", socket.id, continentIdx, countryIdx, cityIdx);
        setInfectivity(infectivity - 1);
      }
      console.log(continentIdx, cityIdx);
      console.log("country:", e.target.parentElement.parentElement);
    }
  }

  return (
    <div className="game-board">
      {board.length !== 0 &&
        board.map((continent, continentIdx) => {
          return (
            <div
              key={continent.continent}
              className={`continent-container ${continentIdx}`}
            >
              <h2>{continent.continent}</h2>
              <div className="continent-cards-container">
                {continent.countries.map((country, countryIdx) => {
                  return (
                    <div
                      className={`country-container ${countryIdx}`}
                      key={Math.random()}
                    >
                      {country?.name}
                      <div className="cities-container">
                        {country?.control.map((city, cityIdx) => {
                          return (
                            <div
                              onClick={infectCity}
                              key={Math.random()}
                              className={`city ${city?.color}-city ${cityIdx}`}
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
