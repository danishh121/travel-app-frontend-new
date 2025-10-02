
"use client"
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // adjust path to your slice
import  authReducer from './slices/authSlice';
import tripsReducer from './slices/tripSlice';
import photoReducer from './slices/photoSlice';
import animationReducer from './slices/animationSlice'
import feedReducer from './slices/feedSlice';
import searchReducer from "./slices/searchSlice";
import chatReducer from './slices/chatSlice'



// Create store
export const store = configureStore({
  reducer: {
    user: userReducer, // you can add more slices here
     auth: authReducer,
     trips:tripsReducer,
     photos: photoReducer,
      animation: animationReducer,
      feed :feedReducer,
      search:searchReducer,
     chat:chatReducer
     
  },
});


// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// "use client";

// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// import userReducer from "./slices/userSlice";
// import authReducer from "./slices/authSlice";
// import tripsReducer from "./slices/tripSlice";
// import photoReducer from "./slices/photoSlice";
// import animationReducer from "./slices/animationSlice";
// import feedReducer from "./slices/feedSlice";
// import searchReducer from "./slices/searchSlice";
// import chatReducer from "./slices/chatSlice";

// // Combine all reducers
// const rootReducer = combineReducers({
//   user: userReducer,
//   auth: authReducer,
//   trips: tripsReducer,
//   photos: photoReducer,
//   animation: animationReducer,
//   feed: feedReducer,
//   search: searchReducer,
//   chat: chatReducer,
// });

// // redux-persist config
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["chat", "user"], // only persist these slices
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create store
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // ignore redux-persist warnings
//     }),
// });

// // Persistor
// export const persistor = persistStore(store);

// // Types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
