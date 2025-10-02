"use client";

import { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchConversation, markMessagesAsRead, sendMessage } from "@/redux/thunk/chatThunk";
import { useSocket } from "@/contexts/SocketContext";
import { messageReceived } from "@/redux/slices/chatSlice"


import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageSendInput";

type ChatWindowProps = {
  otherUserId: string | null;
};

export default function ChatWindow({ otherUserId }: ChatWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const { messages, loading, error, conversations, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  if (!socket || !otherUserId) return;

  // join chat room
  socket.emit("subscribeToChat", otherUserId);

  // mark messages as read when opening
  socket.emit("markMessageRead", { otherUserId });

  return () => {
    socket.emit("unsubscribeFromChat", otherUserId);
  };
}, [socket, otherUserId]);


useEffect(() => {
  if (!socket) return;

  // 📩 Receive new messages
//   socket.on("newMessage", (data) => {
//   // data.message ke andar actual message object hoga
//   const messageData = data.message;
  
//   // Agar ye message current chat ka hai tabhi dispatch karo
//   if (messageData.from_user === otherUserId || messageData.to_user === otherUserId) {
//     console.log("📩 socket newMessage:", messageData); 
//     dispatch(messageReceived(messageData));  
//   }
// });
 socket.on("newMessage", (data) => {
    const messageData = data.message;

    // Dispatch only if not duplicate
    dispatch(messageReceived(messageData));
  });

  // 👤 Online/Offline status
  socket.on("userStatusChanged", ({ userId, status }) => {
    console.log("status update:", userId, status);
    // optional: dispatch to store if you track status
  });

  // ✍️ Typing
  socket.on("userTyping", ({ userId, isTyping }) => {
    if (userId === otherUserId) {
      console.log(`${userId} is typing:`, isTyping);
      // optional: set local state for typing indicator
    }
  });

  // ✅ Read receipts
  socket.on("messageRead", ({ messageId, readBy }) => {
    console.log("message read:", messageId, readBy);
    // optional: dispatch to update Redux message state
  });

  return () => {
    socket.off("newMessage");
    socket.off("userStatusChanged");
    socket.off("userTyping");
    socket.off("messageRead");
  };
}, [socket, otherUserId, dispatch]);

  //Find the other user's profile from selectedUser or conversations
  const otherUser  =
    selectedUser && selectedUser.id === otherUserId
      ? selectedUser
      : conversations.find((c) => c.otherUser.id === otherUserId)?.otherUser;

  useEffect(() => {
    if (otherUserId) {
      if(messages.length ===0){

        dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
      }
      dispatch(markMessagesAsRead({ otherUserId })).unwrap();
    }
  }, [otherUserId, dispatch]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (!otherUserId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-emerald-50">
      <ChatHeader  otherUserId={otherUserId} />

      {/* Messages area */}
    <MessageContainer otherUserId={otherUserId} />

      {/* Input box */}
     <MessageInput otherUserId={otherUserId} />
    </div>
  );
}