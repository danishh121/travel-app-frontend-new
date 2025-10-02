"use client";

import ChatWindow from "@/components/chat/chatwindow/ChatWindow";

type Props = {
  isMobileChatOpen: boolean;
  selectedUserId: string | null;
};

export default function ChatWindowContainer({ isMobileChatOpen, selectedUserId }: Props) {
  return (
    <div
      className={`${
        isMobileChatOpen ? "flex" : "hidden"
      } sm:flex flex-1 bg-white min-h-[60vh] sm:min-h-[70vh] transition-all duration-300 ease-in-out`}
    >
      {selectedUserId ? (
        <ChatWindow otherUserId={selectedUserId} key={selectedUserId} />
      ) : (
        <div className="flex items-center justify-center w-full text-emerald-600 text-base font-medium animate-fade-in">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
}
