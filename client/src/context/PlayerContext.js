import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const [playerTurnOrder, setPlayerTurnOrder] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");

  return (
    <PlayerContext.Provider
      value={{
        playerTurnOrder,
        setPlayerTurnOrder,
        players,
        setPlayers,
        currentPlayer,
        setCurrentPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerGlobalContext = () => {
  return useContext(PlayerContext);
};

export { PlayerProvider };
