import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import router from "./routes/router.js";
import getShuffledNumbers from "./utils/shuffleCards.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let players = [];
let gameStarted = false;

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

  socket.on("gameStarted", () => {
    if (!gameStarted) {
      players.forEach((player) => (player.cards = []));
      let cards = getShuffledNumbers();
      console.log(cards);
      for (let i = 1; i <= 5; i++) {
        players.forEach((player) => player.cards.push(cards.shift()));
      }
      console.log(players[0].cards);
      console.log(players[1].cards);
      players.forEach((player) =>
        io.to(player.id).emit("playerCards", player.cards)
      );
      gameStarted = true;
    }
  });

  socket.on("gameEnded", () => {
    gameStarted = false;
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    players = players.filter((player) => player.id !== socket.id);
    io.emit("playerList", players);
  });
});

app.use("/api/v1", router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server running");
  });
}

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
