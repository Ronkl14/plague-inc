import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { usePlayerGlobalContext } from "../context/PlayerContext";

function Lobby() {
  const { players } = usePlayerGlobalContext();
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("red");

  const navigate = useNavigate();

  useEffect(() => {
    if (players.length >= 2) {
      if (players.every((player) => player.ready)) {
        socket.emit("gameStarted");
        navigate("/game");
      }
    }
  }, [players, navigate]);

  function changeUsernameHandler(e) {
    setUsername(e.target.value);
  }

  function colorPickHandler(e) {
    setColor(e.target.value);
  }

  function connectHandler() {
    socket.connect();
    socket.emit("enterLobby", username, color);
  }

  function ReadyHandler() {
    socket.emit("playerReady");
  }

  return (
    <div>
      <h1>Lobby</h1>
      <input value={username} onChange={changeUsernameHandler}></input>
      <select name="color" onChange={colorPickHandler}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
        <option value="orange">Orange</option>
      </select>
      <button onClick={connectHandler}>Connect</button>
      {players.map((player) => (
        <p key={player.id}>
          {player.id}, {player.username}, {player.ready ? "yes" : "no"},
          {player.color}
        </p>
      ))}
      <button onClick={ReadyHandler}>Ready</button>
    </div>
  );
}

export default Lobby;
