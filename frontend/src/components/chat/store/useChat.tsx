import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
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
  senderId: string;
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
  setAccessToken: (token: string | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  createOrGetConversation: (userId: string) => Promise<string>;
  sendMessage: (receiverId: string, text: string, image?: string) => Promise<void>;
}

const BASE_URL = `${API_BASE_URL}/api/messages`;

export const useChat = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  conversations: [],
  isUsersLoading: false,
  isMessageLoading: false,
  accessToken: null,

  setAccessToken: (token: string | null) => {
    set({ accessToken: token });
  },

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

  createOrGetConversation: async (userId: string) => {
    try {
      const { accessToken } = get();
      
      console.log('Creating conversation with userId:', userId);  
      console.log('Access token:', accessToken?.substring(0, 20));  
      
      const response = await axios.post(
        `${BASE_URL}/create-or-get`,
        { participantId: userId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      console.log('Conversation response:', response.data);
      return response.data.conversationId;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      console.error('Backend error:', error.response?.data); 
      toast.error(error.response?.data?.message || 'Failed to create conversation');
      throw error;
    }
  },

  sendMessage: async (receiverId: string, text: string, image?: string) => {
    try {
      const { accessToken } = get();
      
      const response = await axios.post(
        `${BASE_URL}/send/${receiverId}`,
        { text, image },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Add message to store
      set((state) => ({
        messages: [...state.messages, response.data]
      }));

      toast.success('Message sent');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
      throw error;
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  }
}));