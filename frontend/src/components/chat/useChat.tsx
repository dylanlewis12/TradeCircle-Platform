import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';

interface User {
  _id: string;
  userName: string;
  profilePicture?: string;
}

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useChat = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/users`
      );
      set({ users: response.data.users });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessageLoading: true });
    try {
      const res = await axios.get(
        `http://localhost:3000/api/messages/${userId}`
      );
      set({ messages: res.data.messages });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (selectedUser: User | null) => {
    set({ selectedUser });
  }
}));