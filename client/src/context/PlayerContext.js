import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const [playerTurnOrder, setPlayerTurnOrder] = useState([]);

  return (
    <PlayerContext.Provider value={{ playerTurnOrder, setPlayerTurnOrder }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerGlobalContext = () => {
  return useContext(PlayerContext);
};

export { PlayerProvider };
