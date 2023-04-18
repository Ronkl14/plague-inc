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
  const {
    setTraitsLoaded,
    traitsLoaded,
    phase,
    evolved,
    setEvolved,
    showTraits,
  } = useGameGlobalContext();

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

  function evolveTrait(e) {
    // console.log(e.target.parentElement);
    const trait = e.target.parentElement;
    const price = trait.getElementsByClassName("trait-price")[0].textContent;
    const effectDiv = trait
      .getElementsByClassName("trait-effects")[0]
      .getElementsByTagName("p");
    // console.log(effectDiv);
    let effects = [];
    for (let p of effectDiv) {
      const effectArr = p.textContent.split(" ");
      console.log(p.textContent.split(" "));
      effects.push({
        name: effectArr[0].substring(0, effectArr[0].length - 1),
        effect: effectArr[1].substring(1),
      });
    }
    if (players.find((player) => player.id === socket.id).score - price >= 0) {
      socket.emit("evolve", socket.id, price, effects);
      setEvolved(true);
    }
    console.log(effects);
  }

  return (
    traitCards.length !== 0 && (
      <div
        className={`trait-cards-container ${showTraits ? "" : "hide-traits"}`}
      >
        {traitCards.map((card) => (
          <div key={card[0].cardID} className={`trait-card ${card[0].cardID}`}>
            <p className="trait-name">{card[0].name}</p>
            <div className="trait-price">
              <p>{card[0].price}</p>
              <div className="dna-symbol"></div>
            </div>
            <div className="trait-effects">
              {card[0].effects.map((effect) => (
                <p>
                  {effect.name}: +{effect.effect}
                </p>
              ))}
            </div>
            {phase === 3 && !evolved && (
              <button onClick={evolveTrait} className="btn">
                Evolve
              </button>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default PlayerArea;
