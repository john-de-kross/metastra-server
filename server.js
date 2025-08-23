const app = require("./APP");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));
const userSocketMap = new Map();
const lastSeenMap = new Map();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://metastra.vercel.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});



io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);

    io.emit("user-online", userId);
  });
  socket.on("disconnect", () => {
    for (const [userId, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(userId);
        //store timestamp
        const lastSeen = new Date();
        lastSeenMap.set(userId, lastSeen)
        socket.emit("user-offline", {userId, lastSeen});
      }
    }
  });
});

app.set("io", io);
app.set("userSocketMap", userSocketMap);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
