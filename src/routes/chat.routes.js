import { Router } from "express";
import {
  createMessage,
  getMessages,
  deleteTestMessage,
  getTestMessages,
  getConversations,
  deleteMessage,
} from "../controllers/chat.controller.js";
const chatRouter = Router();

chatRouter.route("/conversations/:userId").get(getConversations);
chatRouter.route("/messages/:userId/:conversationId").get(getMessages);
chatRouter.route("/message").post(createMessage);
chatRouter.route("/:userId/:msgId").delete(deleteMessage);

// these for test purposes
chatRouter.route("/message").get(getTestMessages);
chatRouter.route("/message/:userId").delete(deleteTestMessage);

export default chatRouter;
