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
import { useGameGlobalContext } from "../context/GameContext";

const GameRoom = () => {
  const { setPlayerTurnOrder, setCurrentPlayer } = usePlayerGlobalContext();
  const { traitsLoaded, boardLoaded, setGameLoaded } = useGameGlobalContext();

  useEffect(() => {
    socket.on("playerTurns", setPlayerTurnOrder);
    socket.on("currentPlayer", setCurrentPlayer);
  }, [setCurrentPlayer, setPlayerTurnOrder]);

  useEffect(() => {
    if (traitsLoaded && boardLoaded) {
      setGameLoaded(true);
    }
  }, [traitsLoaded, boardLoaded, setGameLoaded]);

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
