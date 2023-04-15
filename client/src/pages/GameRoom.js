import {
  PlayerArea,
  Countries,
  Board,
  PlayerScores,
  TurnPhases,
} from "../components";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useEffect } from "react";
import socket from "../utils/socket";

const GameRoom = () => {
  const { setPlayerTurnOrder, setCurrentPlayer } = usePlayerGlobalContext();

  useEffect(() => {
    socket.on("playerTurns", setPlayerTurnOrder);
    socket.on("currentPlayer", setCurrentPlayer);
  }, [setCurrentPlayer, setPlayerTurnOrder]);

  return (
    <>
      <PlayerScores />
      <TurnPhases />
      <PlayerArea />
      <Countries />
      <Board />
    </>
  );
};

export default GameRoom;
