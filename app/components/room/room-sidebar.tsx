'use client'
import axios from "axios";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoomForm from "../home/roomForm";
import JoinRoomForm from "./join-room-form";
import { usePathname } from "next/navigation";


type Room = {
    id: number
    slug: string
}

export default function RoomSidebar() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { data: session, status } = useSession()
    const params = useParams<{ slug: string[] }>()
    const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug
    const [rooms, setRooms] = useState<Room[]>([])
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
    const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.id) {
            return
        }
        const userId = session.user.id

        async function getRooms() {
            try {
                const res = await axios.get<{ allrooms: Room[] }>(
                    `http://localhost:5000/users/${userId}/rooms`
                )
                setRooms(res.data.allrooms ?? [])
            } catch (error) {
                console.error("Failed to fetch rooms", error)
            }
        }

        getRooms()
    }, [session?.user?.id, status, pathname])

    return <aside
        className={`hidden shrink-0 border-r border-white/[0.06] bg-[#10161f] transition-all duration-200 lg:flex lg:flex-col ${sidebarCollapsed ? "w-[72px]" : "w-[250px]"
            }`}
    >

        {/* Sidebar header */}

        <div
            className={`flex h-[64px] shrink-0 items-center border-b border-white/[0.05] ${sidebarCollapsed
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
                        title="Join room"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-violet-500" onClick={() => setIsJoinRoomOpen(true)}
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
                    const active = slug === room.slug

                    return (
                        <button
                            key={room.slug}
                            type="button"
                            onClick={() => router.push(`/room/${encodeURIComponent(room.slug)}`)}
                            title={
                                sidebarCollapsed
                                    ? room.slug
                                    : undefined
                            }
                            className={`group relative flex h-11 w-full items-center rounded-lg transition ${sidebarCollapsed
                                ? "justify-center"
                                : "gap-3 px-3"
                                } ${active
                                    ? "bg-[#252b3b] text-white"
                                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                }`}
                        >

                            {active && (
                                <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-violet-500" />
                                
                            )}

                    

                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] `}
                            >
                                {/* {room.icon} */}
                            </div>

                            {!sidebarCollapsed && (
                                <div className="flex min-w-0 flex-1 items-center justify-between">

                                    <span className="truncate text-sm font-medium">
                                        {room.slug}
                                    </span>

                                    {/* {room.online > 0 && (
                            <span className="text-[10px] text-slate-500">
                              {room.online}
                            </span>
                          )} */}

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
                    title="Create Room"
                    className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white" onClick={() => setIsCreateRoomOpen(true)}
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.05]">
                        <Plus size={16} />
                    </div>

                    Create room
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
                            onClick={() => setIsCreateRoomOpen(false)}
                            className="text-slate-400 hover:text-white"
                            aria-label="Close create room dialog"
                        >
                            ×
                        </button>
                    </div>

                    <RoomForm
                        onCloseAction={() => setIsCreateRoomOpen(false)}
                        onCreatedAction={(room) => {
                            setRooms((currentRooms) => [...currentRooms, room]);
                            router.push(`/room/${encodeURIComponent(room.slug)}`);
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
                            onClick={() => setIsJoinRoomOpen(false)}
                            className="text-slate-400 hover:text-white"
                            aria-label="Close create room dialog"
                        >
                            ×
                        </button>
                    </div>

                    <JoinRoomForm onJoinedAction={() => setIsJoinRoomOpen(false)}/>
                </div>
            </div>
        )}

    </aside>



}