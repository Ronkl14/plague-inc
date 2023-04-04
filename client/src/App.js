import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lobby from "./pages/Lobby";
import GameRoom from "./pages/GameRoom";

// const socket = io("http://localhost:5000");

function App() {
  // const [players, setPlayers] = useState([]);
  // const [allReady, setAllReady] = useState(false);

  // useEffect(() => {
  //   // Listen for the updated player list from the server
  //   socket.on("playerList", setPlayers);

  //   socket.on("allReady", () => {
  //     setAllReady(true);
  //   });

  //   // Clean up the event listener on unmount
  //   return () => {
  //     socket.off("playerList", setPlayers);
  //     socket.off("allReady");
  //   };
  // }, []);

  // function startGame() {
  //   // Tell the server to start the game
  //   socket.emit("startGame");
  // }

  const router = createBrowserRouter([
    { path: "/", element: <Lobby /> },
    { path: "/game", element: <GameRoom /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
