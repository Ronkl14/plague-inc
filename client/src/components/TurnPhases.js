import React from "react";
import { useState, useEffect } from "react";
import socket from "../utils/socket";
import { usePlayerGlobalContext } from "../context/PlayerContext";
import { useGameGlobalContext } from "../context/GameContext";

const TurnPhases = () => {
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(false);
  const { currentPlayer } = usePlayerGlobalContext();
  const [receivedDNA, setReceivedDNA] = useState(0);
  const {
    gameLoaded,
    phase,
    setPhase,
    countryPlaced,
    setCountryPlaced,
    setEvolved,
    showTraits,
    setShowTraits,
  } = useGameGlobalContext();

  useEffect(() => {
    socket.on("DNAcalculated", setReceivedDNA);
  }, []);

  useEffect(() => {
    function calculateDNA() {
      socket.emit("phaseDNA", currentPlayer.id);
    }

    if (gameLoaded && phase === 1) {
      if (currentPlayer.id === socket.id) {
        setCurrentPlayerTurn(true);
        calculateDNA();
      } else {
        setCurrentPlayerTurn(false);
      }
    }
  }, [currentPlayer, gameLoaded, phase]);

  function turnEndHandler() {
    socket.emit("turnEnded");
    setPhase(1);
  }

  function updateScore() {
    socket.emit("updateScore", receivedDNA, currentPlayer.id);
    nextPhase();
  }

  function finishCountryPhase() {
    nextPhase();
    setCountryPlaced(false);
  }

  function finishEvolvePhase() {
    nextPhase();
    setEvolved(false);
  }

  function nextPhase() {
    setPhase(phase + 1);
  }

  function displayTraits() {
    setShowTraits(!showTraits);
  }

  return (
    <div className="phase">
      <div>
        <h3>Phase 1: DNA</h3>
        {currentPlayer.id === socket.id ? (
          <p>you got {receivedDNA} DNA points</p>
        ) : (
          <p>get DNA points</p>
        )}
        <button
          className="btn"
          disabled={!currentPlayerTurn || phase !== 1}
          onClick={updateScore}
        >
          Next Phase
        </button>
      </div>
      <div className="phase">
        <h3>Phase 2: Country</h3>
        <p>Choose a country card</p>
        <button
          className="btn"
          disabled={!currentPlayerTurn || phase !== 2 || !countryPlaced}
          onClick={finishCountryPhase}
        >
          Next Phase
        </button>
      </div>
      <div className="phase">
        <h3>Phase 3: Evolution</h3>
        <p>Evolve a trait card</p>
        <button
          className="btn"
          disabled={!currentPlayerTurn || phase !== 3}
          onClick={finishEvolvePhase}
        >
          Next Phase
        </button>
      </div>
      <div className="phase">
        <h3>Phase 4: Infection</h3>
        <p>Infect countries</p>
        <button
          className="btn"
          disabled={!currentPlayerTurn || phase !== 4}
          onClick={nextPhase}
        >
          Next Phase
        </button>
      </div>
      <div className="phase">
        <h3>Phase 5: Death</h3>
        <p>Roll a die to destroy countries</p>
        <button
          className="btn"
          disabled={!currentPlayerTurn || phase !== 5}
          onClick={turnEndHandler}
        >
          End turn
        </button>
      </div>
      <div className="trait-card-stack" onClick={displayTraits}></div>
    </div>
  );
};

export default TurnPhases;
