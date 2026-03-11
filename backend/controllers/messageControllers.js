import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get users with existing conversations
export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const conversations = await Conversation.find({
      participants: loggedInUserId
    }).populate("participants");

    const usersWithConversations = conversations.map(conversation => {
      const otherUser = conversation.participants.find(
        participant => participant.id.toString() !== loggedInUserId.toString()
      );
      return otherUser;
    }).filter(user => user !== undefined);

    res.status(200).json(usersWithConversations);
  } catch (error) {
    console.log("Error in getUsersforSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [myId, userToChatId] }
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Send message - FIXED
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { id: receiverId } = req.params;
    const { text, image, conversationId } = req.body;

    console.log('📤 SEND MESSAGE CALLED');
    console.log('   senderId:', senderId);
    console.log('   receiverId:', receiverId);

    if (!text && !image) {
      return res.status(400).json({ message: "Message text or image required" });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text,
      image
    });

    await message.populate('senderId', 'userName profilePicture');

    // ✅ Use imported function, not require()
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    console.log('🔍 Looking for receiver socket ID');
    console.log('   receiverId:', receiverId);
    console.log('   Found socket ID:', receiverSocketId);

    if (receiverSocketId) {
      const messageData = {
        _id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        image: message.image,
        createdAt: message.createdAt
      };

      console.log('✅ EMITTING receiveMessage');
      console.log('   to socket:', receiverSocketId);
      console.log('   message:', messageData);
      
      // ✅ Use imported io
      io.to(receiverSocketId).emit('receiveMessage', messageData);
    } else {
      console.log('⚠️⚠️⚠️ RECEIVER NOT CONNECTED:', receiverId);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        _id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        image: message.image,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('❌ ERROR in sendMessage:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create or get conversation
export const createOrGetConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    console.log('Creating conversation between:', userId, participantId);

    if (!userId || !participantId) {
      return res.status(400).json({ 
        message: 'User ID and participant ID are required' 
      });
    }

    if (userId.toString() === participantId.toString()) {
      return res.status(400).json({ 
        message: "You can't create a conversation with yourself" 
      });
    }

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