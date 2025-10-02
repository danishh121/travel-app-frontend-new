"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useRouter } from "next/navigation";
import User from "@/redux/slices/chatSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ChatHeaderProps = {
  otherUserId: string;
};

export default function ChatHeader({ otherUserId }: ChatHeaderProps) {
  const router = useRouter();
  const { selectedUser } = useSelector((state: RootState) => state.chat);

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-emerald-200 bg-emerald-100">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/profile/${otherUserId}`)}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={selectedUser?.profile_pic_url || undefined}
            alt={selectedUser?.name || "User"}
            className="h-full w-full object-cover border-emerald-200 bg-emerald-100"
          />
          <AvatarFallback>{selectedUser?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <span className="font-semibold text-emerald-900">
            {selectedUser?.name || "Unknown"}
          </span>
          {selectedUser?.online && (
            <span className="block text-xs text-emerald-500">Online</span>
          )}
        </div>
      </div>
    </div>
  );
}
