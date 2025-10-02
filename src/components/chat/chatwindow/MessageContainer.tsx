"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useSocket } from "@/contexts/SocketContext";


type ChatMessageProps = {
  otherUserId: string;
};

export default function MessageContainer({otherUserId }: ChatMessageProps) {
      const dispatch = useDispatch<AppDispatch>();
      const {socket} = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);
    const { messages, loading, error, conversations, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { user} = useSelector((state: RootState) => state.user);
   
    const myUserId = user?.id 

    useEffect(() => {
  if (socket && otherUserId) {
    messages.forEach((msg) => {
      if (!msg.read && msg.sender.id === otherUserId) {
        socket.emit("markMessageRead", { messageId: msg.id, otherUserId });
      }
    });
  }
}, [socket, otherUserId, messages]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <p className="text-sm text-emerald-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!loading && messages.length === 0)
    return <p className="text-sm text-emerald-400">No messages yet</p>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
     {messages.map((msg,index) => (
          <div
            // key={msg.id}
              key={`${msg.id}-${index}`}
            className={`flex ${
              msg.sender.id === myUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender.id === myUserId
                  ? "bg-emerald-500 text-white"
                  : "bg-white border"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs opacity-70 block">
                {new Date(msg.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
