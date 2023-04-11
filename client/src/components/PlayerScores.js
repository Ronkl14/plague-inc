import React from "react";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import socket from "../utils/socket";

const PlayerScores = () => {
  const { playerTurnOrder, players, currentPlayer } = usePlayerGlobalContext();

  function turnEndHandler() {
    socket.emit("turnEnded");
  }

  return (
    <div>
      {playerTurnOrder.map((id) => {
        return (
          <p
            key={id}
            className={`${currentPlayer.id === id ? "current-player" : ""} ${
              players.find((user) => user.id === id).color
            }`}
          >
            {players.find((user) => user.id === id).username}, DNA:
            {players.find((user) => user.id === id).score}
          </p>
        );
      })}
      <button onClick={turnEndHandler}>End turn</button>
    </div>
  );
};

export default PlayerScores;
