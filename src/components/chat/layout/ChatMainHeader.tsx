"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ChatHeaderProps = {
  onBack: () => void;
};

export default function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center p-3 bg-gradient-to-r from-emerald-100 to-teal-100 border-b border-emerald-200 sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="text-emerald-800 hover:bg-emerald-200/50 rounded-full transition-all duration-200 ease-in-out hover:scale-110"
        aria-label="Back to conversations"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <span className="ml-3 text-lg font-semibold text-emerald-900 tracking-tight">
        Messages
      </span>
    </div>
  );
}
