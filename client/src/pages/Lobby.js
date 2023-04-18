import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { usePlayerGlobalContext } from "../context/PlayerContext";

function Lobby() {
  const { players } = usePlayerGlobalContext();
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("red");
  const [showReady, setShowReady] = useState(false);

  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, []);

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
    setShowReady(true);
  }

  function ReadyHandler() {
    socket.emit("playerReady");
  }

  return (
    <div className="lobby">
      <div className="left-lobby">
        <h1>Plague Inc.</h1>
        <p>Enter username:</p>
        <input value={username} onChange={changeUsernameHandler}></input>
        <select name="color" onChange={colorPickHandler}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>
        {!showReady && <button onClick={connectHandler}>Connect</button>}
        {players.map((player) => (
          <p key={player.id}>
            {player.username} {player.ready ? "Ready" : ""}
          </p>
        ))}
        {showReady && <button onClick={ReadyHandler}>Ready</button>}
      </div>
      <video
        className="lobby-video"
        ref={videoRef}
        src="/assets/video/video.mp4"
        width="600"
        autoPlay
        playsInline
        controls
        loop
        muted
      ></video>
    </div>
  );
}

export default Lobby;
