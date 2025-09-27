const app = require("./APP");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const User = require("./MODELS/userModel");
const Message = require("./MODELS/messageModel");
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
    console.log("registered Id:", userId);

    io.emit("user-online", userId);
    console.log("userSocketMap:", [...userSocketMap.keys()]);
  });

  socket.on("send_message", (data) => {
    const user = userSocketMap.get(data.userId);
    if (user) {
      io.to(user).emit("receive_message", data);
    }
  });

  socket.on("get-user-status", (userId, callback) => {
    const isOnline = userSocketMap.has(userId);
    const lastSeen = lastSeenMap.get(userId) || null;
    callback({ isOnline, lastSeen });
  });

  socket.on("typing", (data) => {
    const user = userSocketMap.get(data.receiverId);
    if (user) {
      io.to(user).emit("typing", data);
    }
  });

  socket.on("markAsSeen", ({ messageId, userId }) => {
    const user = userSocketMap.get(userId);
    if (user) {
      io.to(user).emit("messageSeen", { messageId, userId });
      Message.findByIdAndUpdate(messageId, { seen: true }, { new: true })
        .exec()
        .then((msg) => console.log(msg))
        .catch((err) => console.log(err));
    }
  });
  socket.on("disconnect", () => {
    for (const [userId, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(userId);
        //store timestamp
        const lastSeen = new Date();
        lastSeenMap.set(userId, lastSeen);
        User.findByIdAndUpdate(userId, { lastSeen }, { new: true })
          .exec()
          .then((user) => {
            console.log(user);
          })
          .catch((err) => console.log(err));
        io.emit("user-offline", { userId, lastSeen });
      }
    }
  });
});

app.set("io", io);
app.set("userSocketMap", userSocketMap);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
