import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//Get users with existing conversations
export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all conversations for the logged-in user
    const conversations = await Conversation.find({
      participants: loggedInUserId
    }).populate("participants");

    // Extract other participants (not the logged-in user)
    const usersWithConversations = conversations.map(conversation => {
      const otherUser = conversation.participants.find(
        participant => participant._id.toString() !== loggedInUserId.toString()
      );
      return otherUser;
    }).filter(user => user !== undefined);

    res.status(200).json(usersWithConversations);
  } catch (error) {
    console.log("Error in getUsersforSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Find the conversation between two users
    const conversation = await Conversation.findOne({
      participants: { $all: [myId, userToChatId] }
    });

    if (!conversation) {
      return res.status(200).json([]); // No conversation yet
    }

    // Find all messages in this conversation
    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId]
      });
      await conversation.save();
    }

    // Create message with conversationId
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    // Update conversation's lastMessage
    conversation.lastMessage = newMessage._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// backend/controllers/messageController.js
export const createOrGetConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;  // From JWT token

    console.log('Creating conversation between:', userId, participantId);

    // Validate both IDs exist
    if (!userId || !participantId) {
      return res.status(400).json({ 
        message: 'User ID and participant ID are required' 
      });
    }

    // Can't create conversation with yourself
    if (userId === participantId) {
      return res.status(400).json({ 
        message: "You can't create a conversation with yourself" 
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, participantId]
      });
      await conversation.save();
      console.log('New conversation created:', conversation._id);
    } else {
      console.log('Existing conversation found:', conversation._id);
    }

    res.status(200).json({
      message: 'Conversation retrieved/created successfully',
      conversationId: conversation._id
    });
  } catch (error) {
    console.error('Error in createOrGetConversation:', error);
    res.status(500).json({ 
      message: 'Failed to create/get conversation',
      error: error.message 
    });
  }
};