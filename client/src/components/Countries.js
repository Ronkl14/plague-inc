import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { getCountryCard } from "../api/api";
import useFetchCards from "../hooks/useFetchCards";

const Countries = () => {
  const [countryCardsIndices, setCountryCardsIndices] = useState([]);
  const countryCards = useFetchCards(countryCardsIndices, getCountryCard);
  useEffect(() => {
    socket.on("countryCards", setCountryCardsIndices);
  }, []);

  return (
    countryCards.length !== 0 && (
      <div className="country-stack">
        <p className="country-container">Stack</p>
        {countryCards.slice(0, 3).map((country) => (
          <div className="country-container">{country[0].name}</div>
        ))}
      </div>
    )
  );
};

export default Countries;
