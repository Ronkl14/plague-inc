import React from "react";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import socket from "../utils/socket";

const PlayerScores = () => {
  const { playerTurnOrder, players, currentPlayer } = usePlayerGlobalContext();

  return (
    <div>
      {playerTurnOrder.map((id) => {
        return (
          <div
            key={id}
            className={`${currentPlayer.id === id ? "current-player" : ""} ${
              players.find((user) => user.id === id).color
            } player-score`}
          >
            {socket.id === id ? (
              <div className="current-player-symbol symbol-true"></div>
            ) : (
              <div className="current-player-symbol"></div>
            )}
            <p className="user-details">
              {players.find((user) => user.id === id).username}
              <div className="dna-symbol"></div>
              {players.find((user) => user.id === id).score}
            </p>
          </div>
        );
      })}
      {/* <button onClick={turnEndHandler}>End turn</button> */}
    </div>
  );
};

export default PlayerScores;
