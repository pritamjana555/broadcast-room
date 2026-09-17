"use client";

import { useState, type ComponentType } from "react";
import RoomHeader from "./room.header";
import RoomSidebar from "./room-sidebar";

const Sidebar = RoomSidebar as unknown as ComponentType<{
  collapsed: boolean;
  onToggle: () => void;
}>;

export default function RoomShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-[#090d14] text-white">
      <RoomHeader />

      <div className="flex h-[calc(100vh-72px)]">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />

        <section className="min-w-0 flex-1">
          {children}
        </section>
      </div>
    </main>
  );
}