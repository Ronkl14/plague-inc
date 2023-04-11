import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { usePlayerGlobalContext } from "../context/PlayerContext";

function Lobby() {
  const { players, setPlayers } = usePlayerGlobalContext();
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(players);
    if (players.length >= 2) {
      if (players.every((player) => player.ready)) {
        socket.emit("gameStarted");
        navigate("/game");
      }
    }
  }, [players, navigate]);

  function changeHandler(e) {
    setUsername(e.target.value);
  }

  function connectHandler() {
    socket.connect();
    socket.emit("username", username);
  }

  function ReadyHandler() {
    socket.emit("playerReady");
  }

  return (
    <div>
      <h1>Lobby</h1>
      <input value={username} onChange={changeHandler}></input>
      <button onClick={connectHandler}>Connect</button>
      {players.map((player) => (
        <p key={player.id}>
          {player.id}, {player.username}, {player.ready ? "yes" : "no"}
        </p>
      ))}
      <button onClick={ReadyHandler}>Ready</button>
    </div>
  );
}

export default Lobby;
