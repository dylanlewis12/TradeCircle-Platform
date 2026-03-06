import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/authContext/AuthContext.tsx';  

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

export const useChat = create<ChatStore>((set, get) => ({  // ✅ Add get parameter
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      //Use cookies from auth
      const { cookies } = useAuth(); 
      
      const response = await axios.get(
        `http://localhost:3000/api/messages/users`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
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
      const { cookies } = useAuth();  
      
      const res = await axios.get(
        `http://localhost:3000/api/messages/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
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