import React from "react";
import { useState, useEffect } from "react";
import socket from "../utils/socket";
import { usePlayerGlobalContext } from "../context/PlayerContext";

const TurnPhases = () => {
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(false);
  const { currentPlayer } = usePlayerGlobalContext();
  const [receivedDNA, setReceivedDNA] = useState(0);

  useEffect(() => {
    socket.on("DNAcalculated", setReceivedDNA);
  }, []);

  useEffect(() => {
    if (currentPlayer.id === socket.id) {
      setCurrentPlayerTurn(true);
      calculateDNA();
    } else {
      setCurrentPlayerTurn(false);
    }
  }, [currentPlayer]);

  function turnEndHandler() {
    socket.emit("turnEnded");
  }

  function calculateDNA() {
    socket.emit("phaseDNA", currentPlayer.id);
  }

  function updateScore() {
    socket.emit("updateScore", receivedDNA, currentPlayer.id);
  }

  return (
    <div>
      <div>
        <h3>Phase 1: DNA</h3>
        {currentPlayer.id === socket.id ? (
          <p>you got {receivedDNA} DNA points</p>
        ) : (
          <p>get DNA points</p>
        )}
        <button disabled={!currentPlayerTurn} onClick={updateScore}>
          Next Phase
        </button>
      </div>
      <div>
        <h3>Phase 2: Country</h3>
        <p>Choose a country card</p>
        <button disabled={!currentPlayerTurn}>Next Phase</button>
      </div>
      <div>
        <h3>Phase 3: Evolution</h3>
        <p>Evolve a trait card</p>
        <button disabled={!currentPlayerTurn}>Next Phase</button>
      </div>
      <div>
        <h3>Phase 4: Infection</h3>
        <p>Infect countries</p>
        <button disabled={!currentPlayerTurn}>Next Phase</button>
      </div>
      <div>
        <h3>Phase 5: Death</h3>
        <p>Roll a die to destroy countries</p>
      </div>
      <button disabled={!currentPlayerTurn} onClick={turnEndHandler}>
        End turn
      </button>
    </div>
  );
};

export default TurnPhases;
