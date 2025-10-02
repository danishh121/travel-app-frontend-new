// "use client";
// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../redux/store";
// import {
//   setSelectedUser,
//   setConversations,
//   setMessages,
// } from "../redux/slices/chatSlice";

// export default function usePersistedChat() {
//   const dispatch = useDispatch();
//   const { selectedUser, conversations, messages } = useSelector(
//     (state: RootState) => state.chat
//   );

//   // Rehydrate Redux state from localStorage
//   useEffect(() => {
//     const savedUser = localStorage.getItem("chat_selectedUser");
//     if (savedUser) {
//       dispatch(setSelectedUser(JSON.parse(savedUser)));
//     }

//     const savedConversations = localStorage.getItem("chat_conversations");
//     if (savedConversations) {
//       dispatch(setConversations(JSON.parse(savedConversations)));
//     }

//     if (savedUser) {
//       const user = JSON.parse(savedUser);
//       const savedMessages = localStorage.getItem(`chat_messages_${user.id}`);
//       if (savedMessages) {
//         dispatch(setMessages(JSON.parse(savedMessages)));
//       }
//     }
//   }, [dispatch]);

//   // Persist selectedUser
//   useEffect(() => {
//     if (selectedUser) {
//       localStorage.setItem("chat_selectedUser", JSON.stringify(selectedUser));
//     } else {
//       localStorage.removeItem("chat_selectedUser");
//     }
//   }, [selectedUser]);

//   // Persist conversations
//   useEffect(() => {
//     if (conversations.length > 0) {
//       localStorage.setItem(
//         "chat_conversations",
//         JSON.stringify(conversations)
//       );
//     }
//   }, [conversations]);

//   // Persist messages per selected user
//   useEffect(() => {
//     if (selectedUser && messages.length > 0) {
//       localStorage.setItem(
//         `chat_messages_${selectedUser.id}`,
//         JSON.stringify(messages)
//       );
//     }
//   }, [messages, selectedUser]);
// }



// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedUser, setConversations, setMessages } from "@/redux/slices/chatSlice";
// import { RootState } from "@/redux/store";

// export default function PersistedChatProvider() {
//   const dispatch = useDispatch();
//   const { selectedUser, conversations, messages } = useSelector((state: RootState) => state.chat);

//   // Hydrate Redux from localStorage (client-side only)
//   useEffect(() => {
//     const storedUser = localStorage.getItem("chat_selectedUser");
//     if (storedUser) dispatch(setSelectedUser(JSON.parse(storedUser)));

//     const storedConversations = localStorage.getItem("chat_conversations");
//     if (storedConversations) dispatch(setConversations(JSON.parse(storedConversations)));

//     const userId = storedUser ? JSON.parse(storedUser).id : null;
//     if (userId) {
//       const storedMessages = localStorage.getItem(`chat_messages_${userId}`);
//       if (storedMessages) dispatch(setMessages(JSON.parse(storedMessages)));
//     }
//   }, [dispatch]);

//   // Persist selectedUser
//   useEffect(() => {
//     if (selectedUser) localStorage.setItem("chat_selectedUser", JSON.stringify(selectedUser));
//     else localStorage.removeItem("chat_selectedUser");
//   }, [selectedUser]);

//   // Persist conversations
//   useEffect(() => {
//     if (conversations.length > 0) localStorage.setItem("chat_conversations", JSON.stringify(conversations));
//   }, [conversations]);

//   // Persist messages per user
//   useEffect(() => {
//     if (selectedUser && messages.length > 0) {
//       localStorage.setItem(`chat_messages_${selectedUser.id}`, JSON.stringify(messages));
//     }
//   }, [messages, selectedUser]);

//   return null;
// }

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { RootState } from "@/redux/store";

export default function PersistedChatProvider() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state: RootState) => state.chat);

  // Hydrate from localStorage only in browser
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("chat_selectedUser");
    if (storedUser) {
      dispatch(setSelectedUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // Persist changes to localStorage only in browser
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedUser) {
      localStorage.setItem("chat_selectedUser", JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem("chat_selectedUser");
    }
  }, [selectedUser]);

  return null;
}
