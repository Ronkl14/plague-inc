import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayerProvider } from "./context/PlayerContext";
import { GameProvider } from "./context/GameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PlayerProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </PlayerProvider>
  </React.StrictMode>
);
