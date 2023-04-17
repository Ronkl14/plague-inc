import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import router from "./routes/router.js";

import { getShuffledNumbers, resetBoard, updateIdx } from "./utils/index.js";
import {
  NUMBER_OF_TRAIT_CARDS,
  NUMBER_OF_COUNTRY_CARDS,
} from "./constants/constants.js";

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
let board = resetBoard();

io.on("connection", (socket) => {
  // console.log(`New user connected: ${socket.id}`);

  socket.on("enterLobby", (username, color) => {
    players.push({
      id: socket.id,
      username: username,
      ready: false,
      color: color,
      score: 0,
      traitsLoaded: false,
      startingCountryLoaded: false,
    });
    io.emit("playerList", players);
  });

  socket.on("playerReady", () => {
    // console.log(`${socket.id} ready`);
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
      // console.log(players);
      io.emit("playerCards", players);
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

  socket.on("placeStartingCountry", (country, id) => {
    const continentIndex = board.findIndex(
      (continent) => continent.continent === country.continent
    );
    const countryIndex = board[continentIndex].idx;
    board[continentIndex].countries[countryIndex] = {
      ...country,
      control: new Array(country.cities),
      owner: [],
      isFull: false,
    };
    board[continentIndex].countries[countryIndex].control[0] = {
      id: id,
      color: players.find((player) => player.id === id).color,
    };
    board[continentIndex].countries[countryIndex].owner.push(id);
    board[continentIndex].idx += 1;
    io.emit("board", board);
  });

  socket.on("placeCountry", (country, id) => {
    const continentIndex = board.findIndex(
      (continent) => continent.continent === country.continent
    );
    const countryIndex = board[continentIndex].idx;
    if (countryIndex !== -1) {
      board[continentIndex].countries[countryIndex] = {
        ...country,
        control: new Array(country.cities),
        owner: [],
        isFull: false,
      };
      io.emit("board", board);
      io.emit(
        "countryPlaced",
        board[continentIndex].countries[countryIndex].name
      );
      console.log(board[continentIndex].countries[countryIndex].name);
      board[continentIndex].idx = updateIdx(board[continentIndex].countries);
    } else {
      io.emit("fullContinent");
    }
  });

  socket.on("traitsLoaded", (id) => {
    players.find((player) => player.id === id).traitsLoaded = true;
    io.emit("playerList", players);
  });

  socket.on("startingCountryLoaded", (id) => {
    players.find((player) => player.id === id).startingCountryLoaded = true;
    io.emit("playerList", players);
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

  socket.on("phaseDNA", (id) => {
    let DNAcount = 0;
    board.forEach((continent) =>
      continent.countries.map((country) => {
        if (country.owner.includes(id)) {
          DNAcount += 1;
        }
      })
    );
    // console.log(DNAcount);
    io.emit("DNAcalculated", DNAcount);
  });

  socket.on("updateScore", (score, id) => {
    players.find((player) => player.id === id).score += score;
    io.emit("playerList", players);
  });

  socket.on("gameEnded", () => {
    gameStarted = false;
    currentPlayerIndex = 0;
    board = resetBoard();
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
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
  PORT
  // console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
