"use client";

import Sidebar from "@/components/chat/sidebar/SideBar";

type Props = {
  isMobileChatOpen: boolean;
  onSelectConversation: (userId: string) => void;
};

export default function ChatSidebarContainer({ isMobileChatOpen, onSelectConversation }: Props) {
  return (
    <div
      className={`${
        isMobileChatOpen ? "hidden" : "flex"
      } sm:flex w-full sm:w-64 bg-emerald-50/50 border-r border-emerald-100 transition-all duration-300 ease-in-out`}
    >
      <Sidebar onSelectConversation={onSelectConversation} />
    </div>
  );
}
