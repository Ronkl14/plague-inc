import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Lobby, GameRoom } from "./pages";
import { useEffect } from "react";
import { usePlayerGlobalContext } from "./context/PlayerContext";
import socket from "./utils/socket";
import "./css/App.css";

function App() {
  const { setPlayers } = usePlayerGlobalContext();

  useEffect(() => {
    socket.on("playerList", setPlayers);
    return () => {
      socket.off("playerList", setPlayers);
      socket.emit("gameEnded");
    };
  }, [setPlayers]);

  const router = createBrowserRouter([
    { path: "/", element: <Lobby /> },
    { path: "/game", element: <GameRoom /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
