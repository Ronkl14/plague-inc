import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { getCountryCard } from "../api/api";

const Countries = () => {
  const [countryCardsIndices, setCountryCardsIndices] = useState([]);
  const [countryCards, setCountryCards] = useState([]);

  useEffect(() => {
    socket.on("countryCards", setCountryCardsIndices);
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const newCards = await Promise.all(
          countryCardsIndices.map(async (index) => await getCountryCard(index))
        );
        setCountryCards(newCards);
      } catch (error) {}
    };
    fetchCards();
  }, [countryCardsIndices]);

  return (
    <div className="country-stack">
      {countryCards.length === 0 ? (
        ""
      ) : (
        <>
          <p className="country-container">Stack</p>
          <p className="country-container">{countryCards[0][0].name}</p>
          <p className="country-container">{countryCards[1][0].name}</p>
          <p className="country-container">{countryCards[2][0].name}</p>
        </>
      )}
    </div>
  );
};

export default Countries;
