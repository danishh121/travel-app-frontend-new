"use client"
import { createSlice , PayloadAction  } from "@reduxjs/toolkit";
import{  updateUserProfile, fetchUserProfileById, fetchProfile, uploadProfilePicture } from "../thunk/userThunk";
import { followUserProfile, unfollowUserProfile } from "../thunk/feedThunk";
// ✅ Types
export type HomeLocation = {
  id: string;
  continent: string;
  country: string;
  state: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
};

export type Photo = {
  id: string;
  url: string;
};

export type Profile = {
  id: string;
  name: string;
  profilePic: string | null;
   profile_pic_url: string | null;
  bio: string;
  email: string;
  homeLocation: HomeLocation;
  posts: number;
  followers: number;
  following: number;
  totalDistanceKm: number;
  daysSpentTraveling: number;
  photos: Photo[];
  isFollowing?: boolean;
};

// Define API response type
export type ApiResponse = {
  success: boolean;
  message: string;
  data: Profile;
  error: string | null;
};


interface UserState {
  user: Profile | null;      // logged-in user
  profile: Profile | null;   // another user's profile 

  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token : string | null;
}

const initialState: UserState = {
   user: null,
  profile: null,
  // users: {},
  loading: false,
  error: null,
  isAuthenticated: false,
  token:null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
     setUser: (state, action: PayloadAction<{ user: Profile; token: string }>) => {
      state.user = action.payload.user;
  
      state.token = action.payload.token;
      state.isAuthenticated = true;
      console.log("userSlice - setUser:", action.payload.user); // Debug
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
    
      state.token = null;
      state.isAuthenticated = false;
    },
 
  },
  extraReducers: (builder) => {
    
    // ✅ Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
    state.loading = false;
  if (action.payload.success) {
    state.user = action.payload.data;
    state.profile = action.payload.data;
     }else {
        state.error = action.payload.error || "Failed to fetch profile";
        
      }

    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
     builder.addCase(fetchUserProfileById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfileById.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      // state.profile = action.payload;
      if (action.payload.success) {
        state.profile = action.payload.data; // Extract data
      } else {
        state.error = action.payload.error || "Failed to fetch user profile";
      }
      
    });
    builder.addCase(fetchUserProfileById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(followUserProfile.fulfilled, (state, action) => {
  if (state.profile && state.profile.id === action.payload.id) {
    state.profile.isFollowing = true;
  }
  
})  
.addCase(unfollowUserProfile.fulfilled, (state, action) => {
  if (state.profile && state.profile.id === action.payload.id) {
    state.profile.isFollowing = false;
  }
  
});
    // ✅ Update Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user?.id === state.profile?.id) {
        state.profile = { ...state.profile, ...action.payload };
      }
    })
  
      // ✅ Upload profile picture
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.loading = false;
     state.user = { ...state.user, ...action.payload }; // expects user fields
  if (state.user?.id === state.profile?.id) {
    state.profile = state.user;
  }
  
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {  setUser , clearUser } = userSlice.actions;
export default userSlice.reducer;
