"use client"

// src/redux/thunk/chatThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/redux/services/api";
import { RootState } from "../store";

interface User {
  id: string;
  name: string;
  profile_pic_url: string | null;
  online?: boolean;
}

interface Message {
  id: string;
  message: string;
  sent_at: string;
  sender: User;
  receiver: User;
   timestamp: string;
  read?: boolean;
}

interface Conversation {
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

export const fetchConversations = createAsyncThunk<
  Conversation[],
  { page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/fetchConversations",
  async ({ page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await api.get(`/chat/conversations?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetchConversations response:", response.data);

      // Deduplicate conversations by otherUser.id
      const conversations = response.data.data;
      const uniqueConversations = Array.from(
        new Map(conversations.map((c: Conversation) => [c.otherUser.id, c])).values()
      );

      return uniqueConversations as Conversation[];
    } catch (err: any) {
      console.error("fetchConversations error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
    }
  }
);


// export const fetchConversations = createAsyncThunk<
//   Conversation[], // return type of thunk
//   { page?: number; limit?: number }, // argument type
//   { state: RootState; rejectValue: string } // thunkAPI type
// >(
//   "chat/fetchConversations",
//   async ({ page = 1, limit = 20 }, { getState, rejectWithValue }) => {
//     try {
//       const token = (getState() as RootState).auth.token || localStorage.getItem("token");
//       if (!token) return rejectWithValue("No token found");

//       const res = await api.get(`/chat/conversations?page=${page}&limit=${limit}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const raw: any[] = res.data.data || [];

//       // MAP API response to your Conversation type
//       const conversations: Conversation[] = raw.map((c: any) => ({
//         otherUser: c.otherUser,
//         messages: c.messages || [], // <-- ensure messages always exist
//         lastMessage: c.lastMessage || (c.messages && c.messages[c.messages.length - 1]) || null,
//         unreadCount: c.unreadCount || 0,
//       }));

//       // Deduplicate by otherUser.id
//       const unique = Array.from(new Map(conversations.map(c => [c.otherUser.id, c])).values());

//       return unique;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
//     }
//   }
// );


export const fetchConversation = createAsyncThunk<
  Message[],
  { otherUserId: string; page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/fetchConversation",
  async ({ otherUserId, page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await api.get(`/chat/conversation/${otherUserId}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetchConversation response:", response.data);
      return response.data.data || [];
    } catch (err: any) {
      console.error("fetchConversation error:", err);
      if (err.response?.status === 404) {
        return [];
      }
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversation");
    }
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  { toUserId: string; message: string },
  { state: RootState; rejectValue: string }
>(
  "chat/sendMessage",
  async ({ toUserId, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please log in.");
      const res = await api.post(
        `/chat/send`,
        { toUserId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("sendMessage response:", res.data);
      console.log("sendMessage - sender id:", res.data.data.sender.id); // Debug
      return res.data.data;
    } catch (err: any) {
      console.error("sendMessage error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const markMessagesAsRead = createAsyncThunk<
  void,
  { otherUserId: string },
  { state: RootState; rejectValue: string }
>(
  "chat/markMessagesAsRead",
  async ({ otherUserId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      await api.put(
        `/chat/conversation/${otherUserId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Messages marked as read for user ${otherUserId}`);
    } catch (err: any) {
      console.error("markMessagesAsRead error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to mark messages as read");
    }
  }
);

export const deleteMessage = createAsyncThunk<
  string, // return messageId on success
  { messageId: string },
  { state: RootState; rejectValue: string }
>(
  "chat/deleteMessage",
  async ({ messageId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const res = await api.delete(`/chat/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("deleteMessage response:", res.data);
      return messageId;
    } catch (err: any) {
      console.error("deleteMessage error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete message"
      );
    }
  }
);


// Search messages
export const searchMessages = createAsyncThunk<
  Message[],
  { query: string; page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/searchMessages",
  async ({ query, page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token || localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please log in.");

      const res = await api.get(`/chat/search?query=${query}&page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(res)
      return res.data.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to search messages");
    }
  }
);

// Fetch online users
export const fetchOnlineUsers = createAsyncThunk<
  User[], // return list of users
  { page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/fetchOnlineUsers",
  async ({ page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const res = await api.get(`/chat/online-users?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("fetchOnlineUsers response:", res.data);

      // API returns { users: [...], totalCount }
      return res.data.data?.users || [];
    } catch (err: any) {
      console.error("fetchOnlineUsers error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch online users");
    }
  }
);




