import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { getCountryCard } from "../api/api";
import useFetchCards from "../hooks/useFetchCards";

const Countries = () => {
  const [countryCardsIndices, setCountryCardsIndices] = useState([]);
  const countryCards = useFetchCards(countryCardsIndices, getCountryCard);
  const [startingCountryIndex, setStartingCountryIndex] = useState([]);
  const startingCountry = useFetchCards(startingCountryIndex, getCountryCard);

  useEffect(() => {
    socket.on("countryCards", setCountryCardsIndices);
    socket.on("startingCountry", setStartingCountryIndex);
  }, []);

  useEffect(() => {
    console.log(startingCountry);
    if (startingCountry.length !== 0) {
      socket.emit("placeCountry", startingCountry[0][0]);
    }
  }, [startingCountry]);

  return (
    countryCards.length !== 0 && (
      <div className="country-stack">
        <p className="country-container">Stack</p>
        {countryCards.slice(0, 3).map((country) => (
          <div key={country[0].cardID} className="country-container">
            <p>{country[0].name}</p>
            <p>{country[0].continent}</p>
            <div className="cities-container">
              {Array.from({ length: country[0].cities }, (_, i) => (
                <div className={`city ${i}`} key={i}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default Countries;
