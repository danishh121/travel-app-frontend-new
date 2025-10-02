
"use client";

import { AuthGuard } from "@/components/ui/AuthQuard";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <AuthGuard>
      {children}
      </AuthGuard>
      </>
  );
}