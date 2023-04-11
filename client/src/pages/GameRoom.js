import { PlayerArea, Countries, Board, PlayerScores } from "../components";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useEffect } from "react";
import socket from "../utils/socket";

const GameRoom = () => {
  const { setPlayerTurnOrder, setCurrentPlayer, setThisSessionPlayer } =
    usePlayerGlobalContext();

  useEffect(() => {
    socket.on("playerTurns", setPlayerTurnOrder);
    socket.on("currentPlayer", setCurrentPlayer);
    socket.on("thisPlayer", setThisSessionPlayer);
  }, [setCurrentPlayer, setPlayerTurnOrder, setThisSessionPlayer]);

  return (
    <>
      <PlayerScores />
      <PlayerArea />
      <Countries />
      <Board />
    </>
  );
};

export default GameRoom;
