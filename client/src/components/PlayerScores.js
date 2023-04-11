import React from "react";
import { usePlayerGlobalContext } from "../context/PlayerContext";

const PlayerScores = () => {
  const { playerTurnOrder, players, currentPlayer } = usePlayerGlobalContext();

  return (
    <div>
      {playerTurnOrder.map((id) => {
        return (
          <p key={id} className={currentPlayer === id ? "current-player" : ""}>
            {players.find((user) => user.id === id).username}, DNA:
            {players.find((user) => user.id === id).score}
          </p>
        );
      })}
    </div>
  );
};

export default PlayerScores;
