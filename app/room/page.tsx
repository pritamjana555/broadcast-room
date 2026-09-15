"use client";

import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Hash,
  Home,
  Info,
  Laptop,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Plus,
  Search,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react";

type Room = {
  name: string;
  icon: React.ReactNode;
  iconColor: string;
  online: number;
};

type ChatMessage = {
  id: number;
  name: string;
  avatar: string;
  avatarClass: string;
  time: string;
  message: string;
};

type Member = {
  name: string;
  avatar: string;
  avatarClass: string;
  online: boolean;
};

const rooms: Room[] = [
  {
    name: "General",
    icon: <Home size={18} />,
    iconColor: "text-slate-300",
    online: 42,
  },
  {
    name: "Gaming",
    icon: <Gamepad2 size={18} />,
    iconColor: "text-violet-400",
    online: 128,
  },
  {
    name: "Technology",
    icon: <Laptop size={18} />,
    iconColor: "text-blue-400",
    online: 64,
  },
  {
    name: "Music",
    icon: <Music2 size={18} />,
    iconColor: "text-fuchsia-400",
    online: 42,
  },
  {
    name: "Study",
    icon: <BookOpen size={18} />,
    iconColor: "text-cyan-400",
    online: 61,
  },
];

const startingMessages: ChatMessage[] = [
  {
    id: 1,
    name: "Alex",
    avatar: "A",
    avatarClass: "from-violet-500 to-purple-700",
    time: "10:24 PM",
    message: "Anyone playing tonight?",
  },
  {
    id: 2,
    name: "Sam",
    avatar: "S",
    avatarClass: "from-pink-500 to-rose-600",
    time: "10:26 PM",
    message: "Yeah, I'm in! 🎮",
  },
  {
    id: 3,
    name: "Jordan",
    avatar: "J",
    avatarClass: "from-emerald-400 to-green-600",
    time: "10:28 PM",
    message: "What game are we thinking?",
  },
  {
    id: 4,
    name: "Pritam",
    avatar: "P",
    avatarClass: "from-orange-400 to-amber-600",
    time: "10:31 PM",
    message: "Maybe Valorant? 👀",
  },
  {
    id: 5,
    name: "Mike",
    avatar: "M",
    avatarClass: "from-blue-500 to-indigo-600",
    time: "10:33 PM",
    message: "I'm down for that!",
  },
];

const members: Member[] = [
  {
    name: "Alex",
    avatar: "A",
    avatarClass: "from-violet-500 to-purple-700",
    online: true,
  },
  {
    name: "Sam",
    avatar: "S",
    avatarClass: "from-pink-500 to-rose-600",
    online: true,
  },
  {
    name: "Jordan",
    avatar: "J",
    avatarClass: "from-emerald-400 to-green-600",
    online: true,
  },
  {
    name: "Pritam",
    avatar: "P",
    avatarClass: "from-orange-400 to-amber-600",
    online: true,
  },
  {
    name: "Mike",
    avatar: "M",
    avatarClass: "from-blue-500 to-indigo-600",
    online: false,
  },
  {
    name: "Taylor",
    avatar: "T",
    avatarClass: "from-slate-500 to-slate-700",
    online: false,
  },
];

export default function MainRoom() {
  const [activeRoom, setActiveRoom] = useState("Study");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(startingMessages);

  const currentRoom = rooms.find(
    (room) => room.name === activeRoom
  );

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        name: "You",
        avatar: "B",
        avatarClass: "from-violet-500 to-indigo-600",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        message: trimmed,
      },
    ]);

    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#090d14] text-white">
      {/* =========================================================
          APP
      ========================================================= */}

      <div className="flex h-full w-full flex-col bg-[#0f141d]">

        {/* =======================================================
            TOP BAR
        ======================================================= */}

        <header className="flex h-[72px] shrink-0 items-center border-b border-white/[0.06] bg-[#111720] px-4 sm:px-6">

          {/* Logo */}

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_6px_20px_rgba(124,58,237,0.3)]">
              <MessageCircle
                size={22}
                strokeWidth={2.4}
              />
            </div>

            <span className="hidden text-[21px] font-semibold tracking-tight sm:block">
              chatroom
            </span>
          </div>

          {/* Search */}

          <div className="mx-auto hidden w-full max-w-[440px] md:block">
            <div className="flex h-10 items-center gap-3 rounded-full border border-white/[0.06] bg-[#191f2a] px-4">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search rooms or messages..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

            </div>
          </div>

          {/* Right */}

          <div className="ml-auto flex items-center gap-2">

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="mx-2 hidden h-6 w-px bg-white/[0.07] sm:block" />

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-semibold"
            >
              B

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111720] bg-emerald-500" />
            </button>

          </div>
        </header>

        {/* =======================================================
            MAIN
        ======================================================= */}

        <div className="flex min-h-0 flex-1">

          {/* =====================================================
              ROOM SIDEBAR
          ===================================================== */}

          <aside
            className={`hidden shrink-0 border-r border-white/[0.06] bg-[#10161f] transition-all duration-200 lg:flex lg:flex-col ${
              sidebarCollapsed ? "w-[72px]" : "w-[250px]"
            }`}
          >

            {/* Sidebar header */}

            <div
              className={`flex h-[64px] shrink-0 items-center border-b border-white/[0.05] ${
                sidebarCollapsed
                  ? "justify-center"
                  : "justify-between px-4"
              }`}
            >

              {!sidebarCollapsed && (
                <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                  ROOMS
                </span>
              )}

              <div className="flex items-center gap-2">

                {!sidebarCollapsed && (
                  <button
                    type="button"
                    title="Create room"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500"
                  >
                    <Plus size={17} />
                  </button>
                )}

                <button
                  type="button"
                  title={
                    sidebarCollapsed
                      ? "Expand sidebar"
                      : "Collapse sidebar"
                  }
                  onClick={() =>
                    setSidebarCollapsed(
                      !sidebarCollapsed
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.1] hover:text-white"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight size={17} />
                  ) : (
                    <ChevronLeft size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* Room list */}

            <div className="min-h-0 flex-1 overflow-y-auto p-3">

              <div className="space-y-1">

                {rooms.map((room) => {
                  const active =
                    activeRoom === room.name;

                  return (
                    <button
                      key={room.name}
                      type="button"
                      onClick={() =>
                        setActiveRoom(room.name)
                      }
                      title={
                        sidebarCollapsed
                          ? room.name
                          : undefined
                      }
                      className={`group relative flex h-11 w-full items-center rounded-lg transition ${
                        sidebarCollapsed
                          ? "justify-center"
                          : "gap-3 px-3"
                      } ${
                        active
                          ? "bg-[#252b3b] text-white"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      }`}
                    >

                      {active && (
                        <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-violet-500" />
                      )}

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ${room.iconColor}`}
                      >
                        {room.icon}
                      </div>

                      {!sidebarCollapsed && (
                        <div className="flex min-w-0 flex-1 items-center justify-between">

                          <span className="truncate text-sm font-medium">
                            {room.name}
                          </span>

                          {room.online > 0 && (
                            <span className="text-[10px] text-slate-500">
                              {room.online}
                            </span>
                          )}

                        </div>
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Create room */}

            {!sidebarCollapsed && (
              <div className="border-t border-white/[0.06] p-3">

                <button
                  type="button"
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.05]">
                    <Plus size={16} />
                  </div>

                  Create room
                </button>

              </div>
            )}

          </aside>

          {/* =====================================================
              CHAT AREA
          ===================================================== */}

          <section className="relative flex min-w-0 flex-1 flex-col">

            {/* Chat header */}

            <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">

              <div className="flex min-w-0 items-center gap-3">

                <Hash
                  size={23}
                  className="shrink-0 text-slate-500"
                />

                <div className="min-w-0">

                  <h2 className="truncate text-[17px] font-semibold">
                    {activeRoom}
                  </h2>

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <span className="text-xs text-slate-500">
                      {currentRoom?.online ?? 0} people talking
                    </span>

                  </div>

                </div>

              </div>

              {/* Chat actions */}

              <div className="flex items-center gap-1.5">

                <button
                  type="button"
                  onClick={() =>
                    setMembersOpen(!membersOpen)
                  }
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition ${
                    membersOpen
                      ? "bg-violet-500/10 text-violet-300"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Users size={17} />

                  <span className="hidden sm:inline">
                    {currentRoom?.online ?? 0}
                  </span>
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <Info size={18} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <MoreHorizontal size={18} />
                </button>

              </div>

            </div>

            {/* ===================================================
                MESSAGES
            =================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              <div className="mx-auto w-full max-w-[850px] px-4 py-6 sm:px-6">

                <div className="space-y-5">

                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start gap-3"
                    >

                      {/* Avatar */}

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.avatarClass} text-sm font-semibold shadow-lg`}
                      >
                        {item.avatar}
                      </div>

                      {/* Message */}

                      <div className="min-w-0">

                        <div className="flex items-baseline gap-2">

                          <span className="text-sm font-semibold text-slate-100">
                            {item.name}
                          </span>

                          <span className="text-[10px] text-slate-600">
                            {item.time}
                          </span>

                        </div>

                        <p className="mt-0.5 break-words text-sm leading-6 text-slate-300">
                          {item.message}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* ===================================================
                MESSAGE INPUT
            =================================================== */}

            <div className="shrink-0 border-t border-white/[0.05] bg-[#10161f] p-3 sm:p-4">

              <div className="mx-auto flex max-w-[850px] items-center gap-2 rounded-xl border border-white/[0.07] bg-[#191f2a] px-2 py-2">

                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Plus size={18} />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={`Message #${activeRoom}`}
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
                />

                <button
                  type="button"
                  className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:text-white sm:flex"
                >
                  <Smile size={18} />
                </button>

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send
                    size={16}
                    className="-rotate-6"
                  />
                </button>

              </div>

            </div>

            {/* ===================================================
                MEMBERS PANEL

                IMPORTANT:
                This is absolute/overlay.
                It does NOT resize or shift the chat.
            =================================================== */}

            {membersOpen && (
              <aside className="absolute inset-y-0 right-0 z-30 flex w-[260px] flex-col border-l border-white/[0.07] bg-[#111720] shadow-[-20px_0_50px_rgba(0,0,0,0.25)]">

                {/* Members header */}

                <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4">

                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-slate-300">
                      MEMBERS
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600">
                      {currentRoom?.online ?? 0} people talking
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMembersOpen(false)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <X size={17} />
                  </button>

                </div>

                {/* Member list */}

                <div className="min-h-0 flex-1 overflow-y-auto p-4">

                  {/* Online */}

                  <div>

                    <p className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-slate-600">
                      ONLINE —{" "}
                      {members.filter(
                        (member) => member.online
                      ).length}
                    </p>

                    <div className="space-y-1">

                      {members
                        .filter(
                          (member) => member.online
                        )
                        .map((member) => (
                          <MemberRow
                            key={member.name}
                            member={member}
                          />
                        ))}

                    </div>

                  </div>

                  {/* Divider */}

                  <div className="my-5 h-px bg-white/[0.06]" />

                  {/* Offline */}

                  <div>

                    <p className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-slate-600">
                      OFFLINE —{" "}
                      {members.filter(
                        (member) => !member.online
                      ).length}
                    </p>

                    <div className="space-y-1">

                      {members
                        .filter(
                          (member) => !member.online
                        )
                        .map((member) => (
                          <MemberRow
                            key={member.name}
                            member={member}
                          />
                        ))}

                    </div>

                  </div>

                </div>

              </aside>
            )}

          </section>

        </div>

      </div>

      {/* =========================================================
          SCROLLBAR
      ========================================================= */}

      <style jsx global>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }

        *::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 999px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}

/* =============================================================
   MEMBER ROW
============================================================= */

function MemberRow({
  member,
}: {
  member: Member;
}) {
  return (
    <div
      className={`flex h-11 items-center gap-3 rounded-lg px-2 transition ${
        member.online
          ? "hover:bg-white/[0.04]"
          : "opacity-40"
      }`}
    >

      <div className="relative shrink-0">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${member.avatarClass} text-xs font-semibold`}
        >
          {member.avatar}
        </div>

        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111720] ${
            member.online
              ? "bg-emerald-500"
              : "bg-slate-600"
          }`}
        />

      </div>

      <span className="truncate text-sm text-slate-300">
        {member.name}
      </span>

    </div>
  );
}