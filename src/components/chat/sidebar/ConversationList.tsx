"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchConversations, markMessagesAsRead } from "@/redux/thunk/chatThunk";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";

type Props = {
  onSelectConversation: (userId: string) => void;
};

export default function ConversationList({ onSelectConversation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading, error, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const [showMarkAsRead, setShowMarkAsRead] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleToggleMarkAsRead = (userId: string) => {
    setShowMarkAsRead((prev) => (prev === userId ? null : userId));
  };

  const handleMarkAsRead = (userId: string) => {
    dispatch(markMessagesAsRead({ otherUserId: userId }))
      .unwrap()
      .then(() => setShowMarkAsRead(null))
      .catch((err) => console.error("Failed to mark messages as read:", err));
  };

  if (loading) return <p className="p-4 text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="p-4 text-sm text-red-500">{error}</p>;
  if (!loading && conversations.length === 0)
    return <p className="p-4 text-sm text-gray-400">No conversations yet</p>;

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((c, index) => (
        <ConversationItem
          key={`${c.otherUser.id}-${index}`}
          conversation={c}
          selectedUser={selectedUser}
          onSelectConversation={onSelectConversation}
          onToggleMarkAsRead={handleToggleMarkAsRead}
          onMarkAsRead={handleMarkAsRead}
          showMarkAsRead={showMarkAsRead}
        />
      ))}
    </div>
  );
}
