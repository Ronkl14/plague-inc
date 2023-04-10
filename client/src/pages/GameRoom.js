import { PlayerArea, Countries, Board } from "../components";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useEffect } from "react";
import socket from "../utils/socket";

const GameRoom = () => {
  const { playerTurnOrder, setPlayerTurnOrder } = usePlayerGlobalContext();

  useEffect(() => {
    socket.on("playerTurns", setPlayerTurnOrder);
  }, []);

  useEffect(() => {
    console.log(playerTurnOrder);
  }, [playerTurnOrder]);

  return (
    <>
      <PlayerArea />
      <Countries />
      <Board />
    </>
  );
};

export default GameRoom;
