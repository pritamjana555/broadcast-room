"use client";

import axios from "axios";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoomForm from "../home/roomForm";
import JoinRoomForm from "./join-room-form";

type Room = {
    id: number;
    slug: string;
};

const ROOM_COLORS = [
    "from-violet-400 to-purple-500",
    "from-rose-400 to-pink-500",
    "from-amber-300 to-orange-400",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
];

function getRoomColor(slug: string) {
    let hash = 0;

    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }

    return ROOM_COLORS[Math.abs(hash) % ROOM_COLORS.length];
}

export default function RoomSidebar() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const { data: session, status } = useSession();
    const params = useParams<{ slug: string[] }>();
    const slug = Array.isArray(params.slug)
        ? params.slug.join("/")
        : params.slug;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
    const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleResponsiveSidebar = () => {
            if (window.innerWidth >= 1024) {
                setSidebarCollapsed(false);
            } else {
                setSidebarCollapsed(true);
            }
        };

        handleResponsiveSidebar();
        window.addEventListener("resize", handleResponsiveSidebar);

        return () => {
            window.removeEventListener("resize", handleResponsiveSidebar);
        };
    }, []);

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.id) {
            return;
        }

        const userId = session.user.id;

        async function getRooms() {
            try {
                const res = await axios.get<{ allrooms: Room[] }>(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/rooms`
                );

                setRooms(res.data.allrooms ?? []);
            } catch (error) {
                console.error("Failed to fetch rooms", error);
            }
        }

        getRooms();
    }, [session?.user?.id, status, pathname]);

    const handleMobileSidebarToggle = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    return (
        <aside
            className={`flex shrink-0 flex-col border-r border-white/[0.06] bg-[#10161f] transition-all duration-200 ${sidebarCollapsed
                    ? "w-[60px] md:w-[72px]"
                    : "absolute inset-y-0 left-0 z-40 w-[250px] shadow-2xl lg:relative lg:z-auto"
                }`}
        >
            <div
    className={`flex shrink-0 items-center border-b border-white/[0.05] px-2 ${
        sidebarCollapsed
            ? "flex-col gap-3 py-3 justify-center"
            : "h-[64px] justify-between px-4"
    }`}
>
    {!sidebarCollapsed && (
        <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">
            ROOMS
        </span>
    )}

    <div
        className={`flex items-center ${
            sidebarCollapsed ? "flex-col gap-3" : "gap-2"
        }`}
    >
        <button
            type="button"
            title={
                sidebarCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
            }
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.1] hover:text-white cursor-pointer"
        >
            {sidebarCollapsed ? (
                <ChevronRight size={17} />
            ) : (
                <ChevronLeft size={17} />
            )}
        </button>

        <button
            type="button"
            title="Join room"
            onClick={() => setIsJoinRoomOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500 cursor-pointer"
        >
            <Plus size={17} />
        </button>
    </div>
</div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                    {rooms.map((room) => {
                        const active = slug === room.slug;

                        return (
                            <button
                                key={room.slug}
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/room/${encodeURIComponent(
                                            room.slug
                                        )}`
                                    )
                                }
                                title={room.slug}
                                className={`group relative flex h-11 w-full items-center justify-center rounded-lg transition ${sidebarCollapsed
                                        ? ""
                                        : "lg:justify-start gap-3 lg:px-3 "
                                    } ${active
                                        ? "bg-[#252b3b] text-white"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 gap-3"
                                    }`}
                            >
                                {active && (
                                    <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-violet-500 " />
                                )}

                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getRoomColor(
                                        room.slug
                                    )} text-[11px] font-bold text-white shadow-sm ring-1 ring-white/10`}
                                >
                                    {room.slug.charAt(0).toUpperCase()}
                                </div>

                                {!sidebarCollapsed && (
                                    <div className="min-w-0 flex-1 items-center justify-between lg:flex">
                                        <span className="truncate text-sm font-medium">
                                            {room.slug}
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {!sidebarCollapsed && (
                <div className="border-t border-white/[0.06] p-3">
                    <button
                        type="button"
                        title="Create Room"
                        onClick={() => setIsCreateRoomOpen(true)}
                        className="flex h-10 w-full items-center justify-center gap-3 rounded-lg text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white lg:justify-start lg:px-3 cursor-pointer"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05]">
                            <Plus size={16} />
                        </div>

                        <span className="">
                            Create room
                        </span>
                    </button>
                </div>
            )}

            {isCreateRoomOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setIsCreateRoomOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-[#151c27] p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                Create a room
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreateRoomOpen(false)
                                }
                                className="cursor-pointer text-slate-400 hover:text-white"
                                aria-label="Close create room dialog"
                            >
                                <X />
                            </button>
                        </div>

                        <RoomForm
                            onCloseAction={() =>
                                setIsCreateRoomOpen(false)
                            }
                            onCreatedAction={(room) => {
                                setRooms((currentRooms) => [
                                    ...currentRooms,
                                    room,
                                ]);

                                router.push(
                                    `/room/${encodeURIComponent(
                                        room.slug
                                    )}`
                                );
                            }}
                        />
                    </div>
                </div>
            )}

            {isJoinRoomOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setIsJoinRoomOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-[#151c27] p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                Join a room
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsJoinRoomOpen(false)
                                }
                                className="cursor-pointer text-slate-400 hover:text-white"
                                aria-label="Close join room dialog"
                            >
                                <X />
                            </button>
                        </div>

                        <JoinRoomForm
                            onJoinedAction={() =>
                                setIsJoinRoomOpen(false)
                            }
                        />
                    </div>
                </div>
            )}
        </aside>
    );
}

