import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

function Lobby() {
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("playerList", setPlayers);
    return () => {
      socket.off("playerList", setPlayers);
    };
  }, []);

  useEffect(() => {
    if (players.length >= 2) {
      if (players.every((player) => player.ready)) {
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
        <p>
          {player.id}, {player.username}, {player.ready ? "yes" : "no"}
        </p>
      ))}
      <button onClick={ReadyHandler}>Ready</button>
    </div>
  );
}

export default Lobby;
