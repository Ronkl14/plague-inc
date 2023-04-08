import io from "socket.io-client";

let socket;

if (process.env.NODE_ENV === "production") {
  socket = io("/", { autoConnect: false, transports: ["websocket"] });
} else {
  socket = io("http://localhost:5000", { autoConnect: false });
}

export default socket;
