import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { getCountryCard } from "../api/api";
import useFetchCards from "../hooks/useFetchCards";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useGameGlobalContext } from "../context/GameContext";

const Countries = () => {
  const [countryCardsIndices, setCountryCardsIndices] = useState([]);
  const countryCards = useFetchCards(countryCardsIndices, getCountryCard);
  const [startingCountryIndex, setStartingCountryIndex] = useState([]);
  const startingCountry = useFetchCards(startingCountryIndex, getCountryCard);
  const { players, currentPlayer } = usePlayerGlobalContext();
  const {
    setBoardLoaded,
    boardLoaded,
    phase,
    countryPlaced,
    setCountryPlaced,
  } = useGameGlobalContext();
  const [countryCardsState, setCountryCardsState] = useState([]);

  useEffect(() => {
    socket.on("countryCards", setCountryCardsIndices);
    socket.on("startingCountry", setStartingCountryIndex);
    socket.on("countryPlaced", (countryName) => {
      console.log("before:", countryCardsState);
      setCountryPlaced(true);
      setCountryCardsState((prevState) => {
        return prevState.filter((country) => country[0].name !== countryName);
      });
      console.log("state length:", countryCardsState.length);
    });
  }, []);

  useEffect(() => {
    if (startingCountry.length !== 0) {
      socket.emit("placeStartingCountry", startingCountry[0][0], socket.id);
      socket.emit("startingCountryLoaded", socket.id);
    }
  }, [startingCountry]);

  useEffect(() => {
    if (players.every((player) => player.startingCountryLoaded)) {
      setBoardLoaded(true);
    }
  }, [players]);

  useEffect(() => {
    if (boardLoaded) {
      console.log("board:", boardLoaded);
    }
  }, [boardLoaded]);

  useEffect(() => {
    console.log(countryCards);
    if (countryCards.length !== 0) {
      setCountryCardsState(countryCards);
    }
  }, [countryCards]);

  useEffect(() => {
    console.log("country cards state:", countryCardsState);
  }, [countryCardsState]);

  function placeCountry(e) {
    const countryDiv = e.target.parentElement;
    const countryName = countryDiv.getElementsByClassName("country-name");
    const country = countryCards.find(
      (card) => card[0].name === countryName[0].textContent
    )[0];
    console.log(country);
    socket.emit("placeCountry", country, socket.id);
  }

  return (
    countryCardsState.length !== 0 && (
      <div className="country-stack">
        <p className="country-container">Stack</p>
        {countryCardsState.slice(0, 3).map((country) => (
          <div key={country[0].cardID} className="country-container">
            <p className="country-name">{country[0].name}</p>
            <p className="country-continent">{country[0].continent}</p>
            <div className="cities-container">
              {Array.from({ length: country[0].cities }, (_, i) => (
                <div className={`city ${i}`} key={i}></div>
              ))}
            </div>
            {phase === 2 &&
              currentPlayer.id === socket.id &&
              !countryPlaced && (
                <button className="place-country-btn" onClick={placeCountry}>
                  Place Country
                </button>
              )}
          </div>
        ))}
      </div>
    )
  );
};

export default Countries;
