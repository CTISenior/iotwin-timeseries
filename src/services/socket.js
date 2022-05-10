import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // wss, https
  //path: '/',
  cors: {
    origin: '*',
  }
});

let topic;

  io.on('connection', (socket) => {
    console.log(`socket_id: ${socket.id}`)

    socket.on('telemetry_topic', (arg) => {
      if (arg) {
        topic = arg.toString();
      }
    });
  });

export { httpServer };