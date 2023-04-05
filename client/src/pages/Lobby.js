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

  //   const [ready, setReady] = useState(false);

  //   function handleReady() {
  //     // Tell the server that this player is ready
  //     socket.emit("playerReady");

  //     // Update the local ready state
  //     setReady(true);

  //     // Check if all players are ready
  //     const allPlayersReady = players.every((player) => player.ready);

  //     if (allPlayersReady) {
  //       // Tell the server that all players are ready
  //       socket.emit("allReady");

  //       // Update the allReady state
  //       setAllReady(true);
  //     }
  //   }

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
      {/* <p>Players:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} {player.ready ? "(Ready)" : ""}
          </li>
        ))}
      </ul>
      {!ready && <button onClick={handleReady}>Ready</button>}
      {ready && <p>Waiting for other players to get ready...</p>}
      {players.length >= 2 && <button onClick={startGame}>Start Game</button>} */}
    </div>
  );
}

export default Lobby;
