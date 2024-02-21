import { ConversationModel } from "../models/conversation.model.js";
import { MessageModel } from "../models/message.model.js";

// The createMessage controller creates conversation with message for first request, for second request it's create a new message only if the request comes from the same or existing participants.
const createMessage = async (req, res) => {
  try {
    const { conversation, message } = req.body;
    const isExist = await ConversationModel.findOne({
      participants: { $all: conversation.participants },
    });

    // checking conversation existence for creating new message
    if (isExist?._id) {
      const result = await MessageModel.create({
        ...message,
        conversationId: isExist._id,
      });

      if (result?._id) {
        const conMsgsUp = await ConversationModel.updateOne(
          {
            _id: isExist._id,
          },
          { lastMessage: message.message, $push: { messages: result._id } }
        );
        if (!conMsgsUp.modifiedCount) {
          // TODO: If haven't updated the message id in the messages list of conversation then I will update the delPart1 or 2 message.
        }
        return res
          .status(200)
          .send({ result, message: "Created message success." });
      }

      return res
        .status(500)
        .send({ message: "Cannot created message.", status: "failed!" });
    }

    const conversationResult = await ConversationModel.create(conversation);

    if (conversationResult?._id) {
      const messageBody = {
        ...message,
        conversationId: conversationResult._id,
      };

      const messageRes = await MessageModel.create(messageBody);
      if (messageRes?._id) {
        await ConversationModel.updateOne(
          {
            _id: conversationResult._id,
          },
          { $push: { messages: messageRes._id } }
        );
      } else {
        await ConversationModel.deleteOne({
          _id: conversationResult._id,
        });
        return res
          .status(500)
          .send({ success: false, message: "Internal server error!" });
      }
    }

    return res
      .status(200)
      .send({ message: "Conversation created success.", success: true });
  } catch (error) {
    return res.status(500).send({ success: false, error: error });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // conversations finding solution one
    const results = await ConversationModel.find({
      $or: [
        {
          participants: {
            $elemMatch: {
              $eq: userId,
            },
          },
          delPart1Msgs: false,
        },
        {
          participants: {
            $size: 2,
            $elemMatch: {
              $eq: userId,
            },
          },
          delPart2Msgs: false,
        },
      ],
    })
      .populate({
        path: "participants",
        select: "fullName avatar",
      })
      .select("participants");

    return res.status(200).send({
      results,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversationId = req.params.conversationId;

    const result = await ConversationModel.findOne({
      _id: conversationId,
    });

    if (result?.participants[0] == userId) {
      const partOneMessages = await MessageModel.find({
        conversationId: conversationId,
        delPart1Msg: false,
      })
        .populate({
          path: "sender",
          select: "fullName avatar ",
        })
        .populate({
          path: "receiver",
          select: "fullName avatar ",
        })
        .sort({ createdAt: 1 });

      return res.status(200).send({
        messages: partOneMessages,
        status: "success",
        success: true,
      });
    } else if (result?.participants[1] == req.userId) {
      const partTwoMessages = await MessageModel.find({
        conversationId: conversationId,
        delPart2Msg: false,
      })
        .populate("sender receiver")
        .sort({ createdAt: 1 });

      return res.status(200).send({
        messages: partTwoMessages,
        status: "success",
        success: true,
      });
    } else {
      return res.status(404).send({
        status: "failed",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversationId = req.params.conversationId;

    const conResult = await ConversationModel.findById({
      _id: conversationId,
    });

    if (conResult?.participants[0] == userId) {
      await ConversationModel.updateOne(
        {
          _id: conversationId,
        },
        {
          delPart1Msgs: true,
        }
      );

      await MessageModel.updateMany({ conversationId }, { delPart1Msg: true });

      return res.status(200).send({
        status: "success",
        success: true,
      });
    } else if (conResult?.participants[1] == userId) {
      await ConversationModel.updateOne(
        {
          _id: conversationId,
        },
        {
          delPart2Msgs: true,
        }
      );

      await MessageModel.updateMany({ conversationId }, { delPart2Msg: true });
      return res.status(200).send({
        status: "success",
        success: true,
      });
    }

    return res.status(404).send({
      status: "failed",
      success: false,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const msgId = req.params.messageId;

    const msgResult = await MessageModel.findById({
      _id: msgId,
    });
    const conResult = await ConversationModel.findById({
      _id: msgResult?.conversationId,
    });

    if (conResult?.participants[0] == userId) {
      // TODO: here I will delete from both side based on req.query
      const deletedMessage = await MessageModel.updateOne(
        {
          _id: msgId,
        },
        {
          delPart1Msg: true,
        }
      );

      return res.status(200).send({
        data: deletedMessage,
      });
    } else if (conResult?.participants[1] == userId) {
      // TODO: here I will delete from both side based on req.query
      const deletedMessage = await MessageModel.updateOne(
        {
          _id: msgId,
        },
        {
          delPart2Msg: true,
        }
      );

      return res.status(200).send({
        data: deletedMessage,
      });
    }

    return res.status(404).send({
      status: "failed",
      success: false,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

// these controller only for test purposes
const getTestMessages = async (req, res) => {
  try {
    // const results = await ConversationModel.findOne({});
    const results = await MessageModel.find({});
    return res.status(200).send({
      count: results.length,
      results,
      message: "Messages fetching success.",
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

const deleteTestMessage = async (req, res) => {
  try {
    const result = await ConversationModel.deleteOne({
      participants: req.params.userId,
    });
    // const result = await MessageModel.deleteOne({
    //   _id: req.params.userId,
    // });
    return res.status(200).send({ result, message: "Deleted success." });
  } catch (error) {
    return res.status(500).send({ status: false, error: error });
  }
};

export {
  createMessage,
  getConversations,
  getMessages,
  deleteConversation,
  deleteMessage,
  deleteTestMessage,
  getTestMessages,
};
