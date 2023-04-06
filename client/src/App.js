import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lobby from "./pages/Lobby";
import GameRoom from "./pages/GameRoom";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Lobby /> },
    { path: "/game", element: <GameRoom /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
