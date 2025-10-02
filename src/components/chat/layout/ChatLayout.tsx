"use client";

import { Card } from "@/components/ui/card";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6 pb-20 sm:pb-24">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl border border-emerald-100 bg-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {children}
      </Card>
    </div>
  );
}
