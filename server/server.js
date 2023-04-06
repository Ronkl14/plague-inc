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

  socket.on("username", (username) => {
    players.push({ id: socket.id, username: username, ready: false });
    io.emit("playerList", players);
  });

  socket.on("startGame", () => {
    io.emit("moveToGameRoom");
  });

  socket.on("playerReady", () => {
    console.log(`${socket.id} ready`);
    const index = players.findIndex((player) => player.id === socket.id);
    players[index].ready = !players[index].ready;
    io.emit("playerList", players);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    players = players.filter((player) => player.id !== socket.id);
    io.emit("playerList", players);
  });
});

app.get("/", (req, res) => res.send("Server running"));

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);