import io from "socket.io-client";

let socket;

if (process.env.NODE_ENV === "production") {
  socket = io("/", { autoConnect: false, transports: ["websocket"] });
} else {
  socket = io("/", { autoConnect: false });
}

export default socket;
