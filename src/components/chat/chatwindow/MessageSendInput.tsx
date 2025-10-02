"use client";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { sendMessage } from "@/redux/thunk/chatThunk";
import { useSocket } from "@/contexts/SocketContext";
type MessageInputProps = {
  otherUserId: string;
};

export default function MessageInput({ otherUserId }: MessageInputProps) {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim() || !otherUserId) return;
    dispatch(sendMessage({ toUserId: otherUserId, message: newMessage }));
    // Also tell socket user stopped typing
    socket?.emit("typing", { toUserId: otherUserId, isTyping: false });
    setNewMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // emit typing event
    socket?.emit("typing", {
      toUserId: otherUserId,
      isTyping: value.length > 0,
    });
  };

  return (
    <div className="p-3 border-t bg-white flex items-center">
      <Input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={handleChange}
        className="flex-1 border border-emerald-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all duration-200"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button
        onClick={handleSend}
        className="ml-2 bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-all duration-200 hover:scale-105"
      >
        Send
      </Button>
    </div>
  );
}
