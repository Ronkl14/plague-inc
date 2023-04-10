import socket from "../utils/socket";
import { useState, useEffect } from "react";
import { getTraitCard } from "../api/api";

const PlayerArea = () => {
  const [cardIndices, setCardIndices] = useState([]);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    socket.on("playerCards", setCardIndices);
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const newCards = await Promise.all(
          cardIndices.map(async (index) => await getTraitCard(index))
        );
        setCards(newCards);
      } catch (error) {}
    };
    fetchCards();
  }, [cardIndices]);

  return (
    <div>
      {cards.length === 0
        ? ""
        : cards.map((card) => <p key={card[0].cardID}>{card[0].name}</p>)}
    </div>
  );
};

export default PlayerArea;
