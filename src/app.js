import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";
import postRouter from "./routes/post.routes.js";

import settingRouter from "./routes/setting.routes.js";

import chatRouter from "./routes/chat.routes.js";

import adminRouter from "./routes/admin.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import textGenaratorRouter from "./routes/textGenarator.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/settings", settingRouter);

app.use("/api/v1/chats", chatRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/vibinai", textGenaratorRouter);

export { app };
