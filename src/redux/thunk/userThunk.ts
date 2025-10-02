"use client"
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import axios from "axios";
import { RootState } from "../store";

export interface UserListItem {
  id: string;
  name: string;
  profile_pic_url: string | null;
  online?: boolean;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  email: string;
}


export const searchUsers = createAsyncThunk<
  UserListItem[], // ✅ success return type
  { search: string; page?: number; limit?: number }, // ✅ args
  { state: RootState; rejectValue: string }
>(
  "user/searchUsers",
  async ({ search, page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // ✅ from Redux
      console.log("🔑 Token used in searchUsers:", token);

      if (!token) {
        return rejectWithValue("Unauthorized: missing token");
      }

      const res = await api.get("/users", {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data; // ✅ backend returns { success, data, pagination }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to search users");
    }
  }
);

// ✅ Login user
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/auth/login", credentials);
//       const { token, user } = res.data;

//       // save token in localStorage
//       localStorage.setItem("token", token);

//       return {user, token};
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || "Login failed");
//     }
//   }
// );

// ✅ Fetch profile
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
       const token = localStorage.getItem("token");

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      console.log(res);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load profile");
    }
  }
);

// ✅ Fetch another user's profile
export const fetchUserProfileById = createAsyncThunk(
  "profile/fetchUserProfileById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      const res = await api.get(`/feed/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);



export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const res = await api.patch("/users/me", profileData, {
     
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(res)
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);


export const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePicture",
  async (file: File, { rejectWithValue }) => {
    if (!file) return rejectWithValue({ message: "No file selected" });

    try {
      const formData = new FormData();
      formData.append("profile_picture", file); // must match backend key

      const response = await api.post(
        "/users/me/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": undefined,
            // DO NOT set Content-Type manually!
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data);
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: "Upload failed" });
    }
  }
);
