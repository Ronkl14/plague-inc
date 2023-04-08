import React from "react";
import socket from "../utils/socket";
import { useState, useEffect } from "react";
import { getCard } from "../api/api";

const GameRoom = () => {
  const [cardIndices, setCardIndices] = useState([]);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    socket.on("playerCards", setCardIndices);
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const newCards = await Promise.all(
          cardIndices.map(async (index) => await getCard(index))
        );
        setCards(newCards);
      } catch (error) {}
    };
    fetchCards();
  }, [cardIndices]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <div>
      {cardIndices.map((card) => (
        <p>{card}</p>
      ))}
      {cards.length === 0 ? "" : cards.map((card) => <p>{card[0].name}</p>)}
    </div>
  );
};

export default GameRoom;
