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

chatRouter.route("/conversations/:userId").get(getConversations);
chatRouter.route("/messages/:userId/:otherId").get(getMessages);

chatRouter.route("/create-message").post(createMessage);
chatRouter.route("/:userId/:msgId").delete(deleteMessage);

chatRouter
  .route("/conversation/:userId/:conversationId")
  .delete(deleteConversation);

// these for test purposes
chatRouter.route("/message").get(getTestMessages);
chatRouter.route("/message/:userId").delete(deleteTestMessage);

export default chatRouter;
