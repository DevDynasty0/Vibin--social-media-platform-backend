// require("dotenv").config({ path: "./env" });

//improved code below also add experimental feature in package.json dev command
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

///socket io
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });


connectDB()
  .then(() => {
    app.on("error", (error) => {
      // console.log("ERRR", error);
      throw error;
    });
    app.get("/", async (req, res) => {
      res.send("Welcome To Vibin' Server");
    });

    const vibinServer = app.listen(process.env.PORT || 8000, () => {
      console.log("Vibin Server is running at port: ", process.env.PORT);
    });

    
    //socket io configuration

    const io = new Server(vibinServer, {
      pingTimeout: 60000,
      cors: {
      origin:[process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_DEV],
      },
    });

    io.on("connection", (socket) => {
      socket.on("setup", (userData) => {
        socket.join(userData?._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room :" + room);
      });

      socket.on("new message", (newMessageRecieved) => {
        console.log(newMessageRecieved, "newMessageRecievedssssssss");

        const { receiver } = newMessageRecieved;
        if (!receiver) {
          return console.log("receiver not defined");
        }

        socket.in(receiver._id).emit("message recieved", newMessageRecieved);
      });

      socket.on("on typing", (typingInfo) => {
        const { receiver } = typingInfo;
        if (!receiver) {
          return console.log("receiver not defined on typing");
        }

        socket.in(receiver).emit("typing recieved", typingInfo);
      });

      socket.on("new notification", (newNotification) => {
        console.log(newNotification, "new notification___");

        const {
          receiverId,
          senderId: { senderId: sender_id },
        } = newNotification;
        if (!receiverId) {
          return console.log("notification not found.");
        }
        if (receiverId == sender_id) {
          return console.log("receiver and sender are the same person.");
        }

        socket.in(receiverId).emit("notification received", newNotification);
      });
    });
  })

  .catch((err) => console.log("mongodb connection failed:", err));

