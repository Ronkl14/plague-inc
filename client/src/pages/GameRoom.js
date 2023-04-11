import { PlayerArea, Countries, Board, PlayerScores } from "../components";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useEffect } from "react";
import socket from "../utils/socket";

const GameRoom = () => {
  const { setPlayerTurnOrder, setCurrentPlayer, setPlayers } =
    usePlayerGlobalContext();

  useEffect(() => {
    socket.on("playerTurns", setPlayerTurnOrder);
    socket.on("currentPlayer", setCurrentPlayer);
    socket.on("playerList", setPlayers);
  }, [setCurrentPlayer, setPlayerTurnOrder, setPlayers]);

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
