import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Lobby, GameRoom } from "./pages";
import { PlayerProvider } from "./context/PlayerContext";
import "./css/App.css";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Lobby /> },
    { path: "/game", element: <GameRoom /> },
  ]);

  return (
    <PlayerProvider>
      <RouterProvider router={router} />
    </PlayerProvider>
  );
}

export default App;
