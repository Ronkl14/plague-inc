import React from "react";
import socket from "../utils/socket";
import { useState, useEffect } from "react";

const GameRoom = () => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    socket.on("playerCards", setCards);
  }, []);

  return (
    <div>
      {cards.map((card) => (
        <p>{card}</p>
      ))}
    </div>
  );
};

export default GameRoom;
