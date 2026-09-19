'use client'
import RoomShell from "@/app/components/room/room-shell";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {data: session, status } = useSession()
  const router = redirect
  if(status === "authenticated"){

    return <RoomShell>{children}</RoomShell>;
  }else{
    router("/login")
  }
}