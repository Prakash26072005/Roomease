// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import cookieParser from "cookie-parser";

// // routes
// import authRoutes from "./routes/auth.routes.js";
// import roomRoutes from "./routes/room.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import bookingRoutes from "./routes/booking.routes.js";
// import messageRoutes from "./routes/message.routes.js";
// import favouriteRoutes from "./routes/favorites.routes.js";
// import passport from "./config/passport.js";
// import Message from "./models/message.model.js";
// import Conversation from "./models/conversation.model.js";

// dotenv.config();

// const app = express();
// const CLIENT_URL = process.env.CLIENT_URL;
// /* ================= MIDDLEWARE ================= */
// app.use(cors({
//   origin: CLIENT_URL,
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());

// /* ================= ROUTES ================= */
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/favorites", favouriteRoutes);
// /* ================= DB ================= */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error(err));

// /* ================= SERVER ================= */
// const server = http.createServer(app);

// /* ================= SOCKET ================= */
// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // 🔥 userId -> socketId map
// const users = new Map();

// io.on("connection", (socket) => {
//   console.log("🟢 User connected:", socket.id);

//   // ================= JOIN =================
//   socket.on("join", (userId) => {
//     users.set(userId.toString(), socket.id);
//   });

//   // ================= SEND MESSAGE =================
//   socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
//     try {
//       const members = [
//         senderId.toString(),
//         receiverId.toString(),
//       ].sort();

//       let convo;

//       try {
//         // 1️⃣ find existing
//         convo = await Conversation.findOne({ members });

//         // 2️⃣ create if not exists
//         if (!convo) {
//           convo = await Conversation.create({ members });
//         }
//       } catch (err) {
//         // 🔥 handle duplicate key error
//         if (err.code === 11000) {
//           convo = await Conversation.findOne({ members });
//         } else {
//           throw err;
//         }
//       }

//       // 3️⃣ create message
//       const message = await Message.create({
//         conversationId: convo._id,
//         sender: senderId,
//         text,
//       });

//       // 4️⃣ update last message
//       convo.lastMessage = text;
//       await convo.save();

//       // 5️⃣ send to receiver
//       const receiverSocket = users.get(receiverId.toString());

//       if (receiverSocket) {
//         io.to(receiverSocket).emit("receiveMessage", message);
//       }

//       // 6️⃣ send back to sender
//       socket.emit("messageSent", message);

//     } catch (err) {
//       console.error("❌ Socket error:", err);
//     }
//   });

//   // ================= DISCONNECT =================
//   socket.on("disconnect", () => {
//     for (let [userId, socketId] of users.entries()) {
//       if (socketId === socket.id) {
//         users.delete(userId);
//         break;
//       }
//     }
//     console.log("🔴 User disconnected");
//   });
// });

// /* ================= START ================= */
// const port = process.env.PORT || 5000;

// server.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import messageRoutes from "./routes/message.routes.js";
import favouriteRoutes from "./routes/favorites.routes.js";
import passport from "./config/passport.js";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

dotenv.config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/favorites", favouriteRoutes);

mongoose.connection.once("open", async () => {
  try {
    await Conversation.collection.dropIndex("members_1");
    console.log("Removed old conversation members index");
  } catch (err) {
    if (err.codeName !== "IndexNotFound") {
      console.error("Conversation index cleanup error:", err.message);
    }
  }

  const conversations = await Conversation.find({
    $or: [{ membersKey: { $exists: false } }, { membersKey: null }],
  });

  for (const conversation of conversations) {
    await conversation.save();
  }
});

/* ================= DB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET ================= */
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔥 userId -> socketId map
const users = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // ================= JOIN =================
  socket.on("join", (userId) => {
    users.set(userId.toString(), socket.id);
  });

  // ================= SEND MESSAGE =================
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const members = [
        senderId.toString(),
        receiverId.toString(),
      ].sort();
      const membersKey = members.join("_");

      let convo;

      try {
        // 1️⃣ find existing
       convo = await Conversation.findOne({ membersKey });

        // 2️⃣ create if not exists
        if (!convo) {
          convo = await Conversation.create({ members, membersKey });
        }
      } catch (err) {
        // 🔥 handle duplicate key error
        if (err.code === 11000) {
         convo = await Conversation.findOne({ membersKey });
        } else {
          throw err;
        }
      }

      // 3️⃣ create message
      const message = await Message.create({
        conversationId: convo._id,
        sender: senderId,
        text,
      });

      // 4️⃣ update last message
      convo.lastMessage = text;
      await convo.save();

      // 5️⃣ send to receiver
      const receiverSocket = users.get(receiverId.toString());

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);
      }

      // 6️⃣ send back to sender
      socket.emit("messageSent", message);

    } catch (err) {
      console.error("❌ Socket error:", err);
    }
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log("🔴 User disconnected");
  });
});

/* ================= START ================= */
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
