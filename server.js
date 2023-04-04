import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let players = [];

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // Add the new player to the list
  socket.on("username", (username) => {
    players.push({ id: socket.id, username: username, ready: false });
    io.emit("playerList", players);
  });

  // Notify all clients of the updated player list

  socket.on("startGame", () => {
    // Move the players to the game room
    io.emit("moveToGameRoom");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the disconnected player from the list
    players = players.filter((playerId) => playerId !== socket.id);

    // Notify all clients of the updated player list
    io.emit("playerList", players);
  });
});

app.get("/", (req, res) => res.send("Server running"));

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
