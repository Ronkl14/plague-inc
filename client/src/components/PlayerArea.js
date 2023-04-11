import socket from "../utils/socket";
import { useState, useEffect } from "react";
import { getTraitCard } from "../api/api";
import useFetchCards from "../hooks/useFetchCards";

const PlayerArea = () => {
  const [cardIndices, setCardIndices] = useState([]);
  const traitCards = useFetchCards(cardIndices, getTraitCard);

  useEffect(() => {
    socket.on("playerCards", setCardIndices);
  }, []);

  return (
    traitCards.length !== 0 &&
    traitCards.map((card) => <p key={card[0].cardID}>{card[0].name}</p>)
  );
};

export default PlayerArea;
