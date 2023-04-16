import { createContext, useContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [traitsLoaded, setTraitsLoaded] = useState(false);
  const [boardLoaded, setBoardLoaded] = useState(false);

  return (
    <GameContext.Provider
      value={{
        traitsLoaded,
        setTraitsLoaded,
        boardLoaded,
        setBoardLoaded,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameGlobalContext = () => {
  return useContext(GameContext);
};

export { GameProvider };
