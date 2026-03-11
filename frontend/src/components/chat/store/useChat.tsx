import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import API_BASE_URL from '../../../config/api';

interface User {
  _id: string;
  userName: string;
  profilePicture?: string;
  email?: string;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string | { _id?: string; id?: string; userName?: string; profilePicture?: string };
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: Date;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: Date;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  conversations: Conversation[];
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null, userId?: string) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  createOrGetConversation: (userId: string) => Promise<string>;
  sendMessage: (receiverId: string, text: string, image?: string) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;
}

const BASE_URL = `${API_BASE_URL}/api/messages`;
let socket: Socket | null = null;
let messageListener: ((newMessage: Message) => void) | null = null;

// Initialize Socket.io 
export const initializeSocket = (token: string, userId: string) => {
  if (socket?.connected) return;

  socket = io(API_BASE_URL, {
    auth: { token },
    query: { userId }, 
    reconnection: true
  });

  socket.on('connect', () => {
    socket?.emit('userOnline', userId);
  });
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
};

export const useChat = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  conversations: [],
  isUsersLoading: false,
  isMessageLoading: false,
  accessToken: null,

  // setAccessToken receives both token and userId
  setAccessToken: (token: string | null, userId?: string) => {
    set({ accessToken: token });
    if (token && userId) {
      initializeSocket(token, userId);  
    }
  },

  // Get conversation list
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { accessToken } = get();

      const response = await axios.get(
        `${BASE_URL}/users`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      set({ users: response.data });
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error(error.response?.data?.error || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get messages with user
  getMessages: async (userId: string) => {
    set({ isMessageLoading: true });
    try {
      const { accessToken } = get();

      const response = await axios.get(
        `${BASE_URL}/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      set({ messages: response.data });
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast.error(error.response?.data?.error || 'Failed to load messages');
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // Create or get conversation
  createOrGetConversation: async (userId: string) => {
    try {
      const { accessToken } = get();

      const response = await axios.post(
        `${BASE_URL}/create-or-get`,
        { participantId: userId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.conversationId;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error(error.response?.data?.message || 'Failed to create conversation');
      throw error;
    }
  },

  sendMessage: async (
    receiverId: string,
    text: string,
    image?: string
  ) => {
    try {
      const { accessToken, messages, selectedUser } = get();

      // Get conversationId from existing messages
      let conversationId = messages[0]?.conversationId;

      if (!conversationId && selectedUser) {
        // If no messages yet, create conversation first
        conversationId = await get().createOrGetConversation(selectedUser._id);
      }

      console.log('📤 Sending message:', { receiverId, text, conversationId });

      const response = await axios.post(
        `${BASE_URL}/send/${receiverId}`,
        {
          text,
          image,
          conversationId
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const newMessage = response.data.data || response.data;

      console.log('✅ Message sent:', newMessage);

      set((state) => ({
        messages: [...state.messages, newMessage]
      }));

      toast.success('Message sent');
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to send message');
      throw error;
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  // Subscribe to real-time messages
  subscribeToMessages: (userId: string) => {
    if (!socket?.connected) {
      console.error('❌ Socket not connected');
      return;
    }

    console.log('📡 Setting up subscription for user:', userId);

    if (messageListener) {
      socket.off('receiveMessage', messageListener);
      console.log('🧹 Cleaned up old listener');
    }

    // Create new listener
    messageListener = (newMessage: Message) => {
      console.log('📨 NEW MESSAGE RECEIVED:', newMessage);
      set((state) => ({
        messages: [...state.messages, newMessage]
      }));
    };

    // Register new listener
    socket.on('receiveMessage', messageListener);
    console.log('✅ New listener registered for user:', userId);
  },

  unsubscribeFromMessages: () => {
    if (socket && messageListener) {
      socket.off('receiveMessage', messageListener);
      messageListener = null;
      console.log('❌ Listener unregistered');
    }
  }
}));