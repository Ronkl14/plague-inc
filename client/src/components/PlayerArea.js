import socket from "../utils/socket";
import { useState, useEffect } from "react";
import { getTraitCard } from "../api/api";
import useFetchCards from "../hooks/useFetchCards";
import { useGameGlobalContext } from "../context/GameContext";
import { usePlayerGlobalContext } from "../context/PlayerContext";

const PlayerArea = () => {
  const [cardIndices, setCardIndices] = useState([]);
  const traitCards = useFetchCards(cardIndices, getTraitCard);
  const { players } = usePlayerGlobalContext();
  const { setTraitsLoaded, traitsLoaded } = useGameGlobalContext();

  useEffect(() => {
    socket.on("playerCards", (players) => {
      const cards = players.find((player) => player.id === socket.id).cards;
      setCardIndices(cards);
    });
  }, [cardIndices]);

  useEffect(() => {
    if (traitCards.length !== 0) {
      socket.emit("traitsLoaded", socket.id);
    }
  }, [traitCards]);

  useEffect(() => {
    if (traitsLoaded) {
      console.log("traits:", traitsLoaded);
    }
  }, [traitsLoaded]);

  useEffect(() => {
    if (players.every((player) => player.traitsLoaded)) {
      setTraitsLoaded(true);
    }
  }, [players]);

  return (
    traitCards.length !== 0 &&
    traitCards.map((card) => <p key={card[0].cardID}>{card[0].name}</p>)
  );
};

export default PlayerArea;
