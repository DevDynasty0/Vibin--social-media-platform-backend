import { Router } from "express";
import {
  createMessage,
  getMessages,
  deleteTestMessage,
  getTestMessages,
  getConversations,
  deleteMessage,
  deleteConversation,
} from "../controllers/chat.controller.js";
const chatRouter = Router();

chatRouter.route("/message").post(createMessage);
chatRouter.route("/conversations/:userId").get(getConversations);
chatRouter.route("/messages/:userId/:conversationId").get(getMessages);
chatRouter
  .route("/conversation/:userId/:conversationId")
  .delete(deleteConversation);
chatRouter.route("/message/:userId/:messageId").delete(deleteMessage);

// these for test purposes
chatRouter.route("/message").get(getTestMessages);
chatRouter.route("/message/:userId").delete(deleteTestMessage);

export default chatRouter;
