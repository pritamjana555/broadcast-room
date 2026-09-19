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
  <main className="fixed inset-0 flex flex-col overflow-hidden bg-[#090d14] text-white">
    <RoomHeader />

    <div className="relative flex min-h-0 flex-1">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />

      <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {children}
      </section>
    </div>
  </main>
);
}