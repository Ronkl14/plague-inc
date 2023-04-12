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
import {
  NUMBER_OF_TRAIT_CARDS,
  NUMBER_OF_COUNTRY_CARDS,
} from "./constants/constants.js";
import { count } from "console";

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
let countries = [];
let gameStarted = false;
let currentPlayerIndex = 0;
let playerTurnOrder, currentPlayer;
let board = [
  {
    continent: "North America",
    countriesNum: 3,
    countries: new Array(3),
    idx: 0,
  },
  {
    continent: "South America",
    countriesNum: 4,
    countries: new Array(4),
    idx: 0,
  },
  {
    continent: "Europe",
    countriesNum: 5,
    countries: new Array(5),
    idx: 0,
  },
  {
    continent: "Africa",
    countriesNum: 5,
    countries: new Array(5),
    idx: 0,
  },
  {
    continent: "Asia",
    countriesNum: 5,
    countries: new Array(5),
    idx: 0,
  },
  {
    continent: "Oceania",
    countriesNum: 3,
    countries: new Array(3),
    idx: 0,
  },
];

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on("enterLobby", (username, color) => {
    players.push({
      id: socket.id,
      username: username,
      ready: false,
      color: color,
      score: 0,
    });
    io.emit("playerList", players);
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
      let cards = getShuffledNumbers(NUMBER_OF_TRAIT_CARDS);
      for (let i = 1; i <= 5; i++) {
        players.forEach((player) => player.cards.push(cards.shift()));
      }
      players.forEach((player) => {
        io.to(player.id).emit("playerCards", player.cards);
      });
      countries = getShuffledNumbers(NUMBER_OF_COUNTRY_CARDS);
      players.forEach((player) => {
        let startingCountry = [];
        startingCountry.push(countries.shift());
        io.to(player.id).emit("startingCountry", startingCountry);
      });
      io.emit("countryCards", countries);
      io.emit("board", board);
      const playerOrderIndices = getShuffledNumbers(players.length);
      playerTurnOrder = new Array(players.length);
      playerOrderIndices.forEach(
        (index) => (playerTurnOrder[index - 1] = players[index - 1].id)
      );
      let scoreReset = 0;
      playerTurnOrder.forEach((id) => {
        const idx = players.findIndex((player) => player.id === id);
        players[idx].score = scoreReset;
        scoreReset += 1;
      });
      currentPlayer = players.find(
        (player) => player.id === playerTurnOrder[currentPlayerIndex]
      );
      io.emit("playerList", players);
      io.emit("playerTurns", playerTurnOrder);
      io.emit("currentPlayer", currentPlayer);
      gameStarted = true;
    }
  });

  socket.on("placeCountry", (country) => {
    console.log(country);
    const continentIndex = board.findIndex(
      (continent) => continent.continent === country.continent
    );
    console.log(board[continentIndex]);
    const countryIndex = board[continentIndex].idx;
    board[continentIndex].countries[countryIndex] = country;
    io.emit("board", board);
  });

  socket.on("turnEnded", () => {
    if (currentPlayerIndex === players.length - 1) {
      currentPlayerIndex = 0;
    } else {
      currentPlayerIndex += 1;
    }
    currentPlayer = players.find(
      (player) => player.id === playerTurnOrder[currentPlayerIndex]
    );
    io.emit("currentPlayer", currentPlayer);
  });

  socket.on("gameEnded", () => {
    gameStarted = false;
    currentPlayerIndex = 0;
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
