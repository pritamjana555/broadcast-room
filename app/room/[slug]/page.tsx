"use client";


import MessageInput from "@/app/components/room/message-input-box";
import axios from "axios";
import {
    Check,
    Copy,
    Hash,
    Info,
    LogOut,
    MoreHorizontal,
    Users,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Room = {
    id: number;
    slug: string;
    shareCode: string;
    adminId: string;
};

type Message = {
    id: number;
    message: string;
    userId: string;
    admin: {
        name: string;
    };
    clientId?: string;
};

export default function Page() {
    const { data: session, status } = useSession();
    const params = useParams<{ slug: string[] }>();
    const router = useRouter();

    const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomId, setRoomId] = useState<number | null>(null);
    const [roomAdminId, setRoomAdminId] = useState<string | null>(null)
    const [roomCode, setRoomCode] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);
    const [membersOpen, setMembersOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);

    const queuedMessagesRef = useRef<
        Array<{
            clientId: string;
            message: string;
        }>
    >([]);

    const isAdmin = !!session?.user?.id && roomAdminId === session.user.id
    /*
     * ------------------------------------------------------------
     * GET ROOM
     * ------------------------------------------------------------
     */

    useEffect(() => {
        if (!slug) return

        async function getRoom() {
            try {
                const response = await axios.get<{
                    room: Room | null
                }>(
                    `${process.env.NEXT_PUBLIC_API_URL}/room/${encodeURIComponent(slug)}`
                )

                setRoomId(response.data.room?.id ?? null)
                setRoomCode(response.data.room?.shareCode ?? "")
                setRoomAdminId(response.data.room?.adminId ?? null)
            } catch (error) {
                console.error("Failed to fetch room", error)

                setRoomId(null)
                setRoomCode("")
                setRoomAdminId(null)
            }
        }

        getRoom()
    }, [slug]);

    /*
     * ------------------------------------------------------------
     * GET USER ROOMS
     * ------------------------------------------------------------
     */

    useEffect(() => {
        if (
            status !== "authenticated" ||
            !session?.user?.id
        ) {
            return;
        }

        const userId = session.user.id;

        async function getRooms() {
            try {
                const res = await axios.get<{
                    allrooms: Room[];
                }>(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/rooms`
                );

                setRooms(res.data.allrooms ?? []);
            } catch (error) {
                console.error(
                    "Failed to fetch rooms",
                    error
                );
            }
        }

        getRooms();
    }, [session?.user?.id, status]);

    /*
     * ------------------------------------------------------------
     * WEBSOCKET
     * ------------------------------------------------------------
     */

    useEffect(() => {
        if (!roomId || status !== "authenticated") return;

        let cancelled = false;
        let socket: WebSocket | null = null;

        async function connect() {
            let token: string;

            try {
                const res = await axios.get<{ token: string }>("/api/ws-token");
                token = res.data.token;
            } catch (error) {
                console.error("Failed to get WebSocket token", error);
                return;
            }

            if(cancelled) return

             socket = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_URL}?token=${encodeURIComponent(token)}`
        );

        



        socketRef.current = socket;

        socket.onopen = () => {
            socket!.send(
                JSON.stringify({
                    type: "join-room",
                    roomId,
                })
            );

            queuedMessagesRef.current.forEach(
                (queuedMessage) => {
                    socket!.send(
                        JSON.stringify({
                            type: "chat",
                            roomId,
                            ...queuedMessage,
                        })
                    );
                }
            );

            queuedMessagesRef.current = [];
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "error") {
                console.error(
                    "Chat server error:",
                    data.message
                );
                return;
            }

            if (data.type === "chat") {
                setMessages((current) => {
                    const incomingMessage =
                        data as Message;

                    const optimisticIndex =
                        current.findIndex(
                            (message) =>
                                message.clientId &&
                                message.clientId ===
                                incomingMessage.clientId
                        );

                    if (optimisticIndex === -1) {
                        return [
                            ...current,
                            incomingMessage,
                        ];
                    }

                    const nextMessages = [...current];

                    nextMessages[optimisticIndex] =
                        incomingMessage;

                    return nextMessages;
                });
            }
        };

        socket.onerror = (event) => {
            console.error(
                "WebSocket connection failed:",
                event
            );
        };

        socket.onclose = (event) => {
            console.log(
                "WS closed:",
                event.code,
                event.reason
            );

            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }
    connect()
       return () => {
        cancelled = true;

        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "leave-room", roomId }));
            }

            socket.close();
        }

        socketRef.current = null;
    };
}, [roomId, status]);

    /*
     * ------------------------------------------------------------
     * GET CHAT HISTORY
     * ------------------------------------------------------------
     */

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await axios.get<{
                    messages: Message[];
                }>(
                    `${process.env.NEXT_PUBLIC_API_URL}/chats/${encodeURIComponent(
                        slug
                    )}`
                );

                setMessages(
                    response.data.messages
                );
            } catch (error) {
                console.error(
                    "Failed to fetch messages:",
                    error
                );
            }
        }

        if (slug) {
            getMessages();
        }
    }, [slug]);

    /*
     * ------------------------------------------------------------
     * COLOR FOR USER AVATAR
     * ------------------------------------------------------------
     */

    function randomColor(userId: string) {
        let hash = 0;

        for (
            let index = 0;
            index < userId.length;
            index++
        ) {
            hash =
                userId.charCodeAt(index) +
                ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;

        return `hsl(${hue}, 65%, 50%)`;
    }

    /*
     * ------------------------------------------------------------
     * CLOSE CHAT
     * ------------------------------------------------------------
     */

    function closeChat() {
        setMoreOpen(false);
        router.push("/room");
    }

    /*
     * ------------------------------------------------------------
     * LEAVE ROOM
     * ------------------------------------------------------------
     */


    async function leaveRoom() {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/leaveroom`, {
                data: {
                    shareCode: roomCode,
                    userId: session?.user?.id
                }
            })

        } catch (error) {
            console.log(error);
        }

        if (
            roomId &&
            socketRef.current?.readyState ===
            WebSocket.OPEN
        ) {
            socketRef.current.send(
                JSON.stringify({
                    type: "leave-room",
                    roomId,
                })
            );
        }

        setMoreOpen(false);
        router.push("/room");
    }

    async function deleteRoom() {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteroom`, {
                data: {
                    roomId, userId: roomAdminId
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    async function copyRoomCode() {
        if (!roomCode) return

        try {
            await navigator.clipboard.writeText(roomCode)

            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 1500)
        } catch (error) {
            console.error("Failed to copy room code:", error)
        }
    }

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
            {/* ================================================== */}
            {/* CHAT HEADER */}
            {/* ================================================== */}

            <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-3 sm:px-6">
                {/* Room title */}
                <div className="flex min-w-0 items-center gap-3">
                    <Hash
                        size={23}
                        className="shrink-0 text-slate-500"
                    />

                    <div className="min-w-0">
                        <h2 className="truncate text-[17px] font-semibold text-white">
                            {decodeURIComponent(
                                slug
                            )}
                        </h2>

                        <div className="flex items-center gap-2">
                            {roomId !== null && (
                                <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                    <span className="text-xs text-slate-500 whitespace-nowrap">
                                        Room is active
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================================================== */}
                {/* RIGHT ACTIONS */}
                {/* ================================================== */}

                <div className="relative flex items-center gap-1.5">
                    {/* Members */}
                    <button
                        type="button"
                        onClick={() =>
                            setMembersOpen(
                                !membersOpen
                            )
                        }
                        className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition cursor-pointer ${membersOpen
                            ? "bg-violet-500/10 text-violet-300"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                            }`}
                    >
                        <Users size={17} />

                        <span className="hidden sm:inline">
                            0
                        </span>
                    </button>

                    {/* ================================================== */}
                    {/* INFO */}
                    {/* ================================================== */}

                    <button
                        type="button"
                        onClick={() => {
                            setInfoOpen(!infoOpen);
                            setMoreOpen(false);
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${infoOpen
                            ? "bg-violet-500/10 text-violet-300"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white cursor-pointer"
                            }`}
                        aria-label="Room information"
                    >
                        <Info size={18} />
                    </button>

                    {/* ================================================== */}
                    {/* MORE BUTTON */}
                    {/* ================================================== */}

                    <button
                        type="button"
                        onClick={() => {
                            setMoreOpen(!moreOpen);
                            setInfoOpen(false);
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${moreOpen
                            ? "bg-white/[0.08] text-white"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white cursor-pointer"
                            }`}
                        aria-label="More options"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {/* ================================================== */}
                    {/* MORE MENU */}
                    {/* ================================================== */}

                    {moreOpen && (
                        <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-white/[0.0   8] bg-[#191f2a] p-1.5 shadow-2xl">
                            {/* Close chat */}
                            <button
                                type="button"
                                onClick={closeChat}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                            >
                                <X
                                    size={17}
                                    className="text-slate-400"
                                />

                                <span>
                                    Close chat
                                </span>
                            </button>

                            {/* Leave room */}
                            {isAdmin ?
                                <button
                                    type="button"
                                    onClick={() => deleteRoom()}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <LogOut size={17} />

                                    <span>
                                        Delete room
                                    </span>
                                </button>
                                :
                                <button
                                    type="button"
                                    onClick={() => leaveRoom()}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <LogOut size={17} />

                                    <span>
                                        Leave room
                                    </span>
                                </button>
                            }

                        </div>
                    )}

                    {/* ================================================== */}
                    {/* INFO POPUP */}
                    {/* ================================================== */}

                    {infoOpen && (
                        <div className="absolute right-0 top-12 z-50 w-[285px] rounded-xl border border-white/[0.08] bg-[#191f2a] p-4 shadow-2xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        Room information
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Share this code to
                                        invite others
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setInfoOpen(
                                            false
                                        )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Room code */}
                            <div>
                                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                    Room code
                                </label>

                                <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#10161f] p-2">
                                    <code className="min-w-0 flex-1 truncate px-1 text-sm text-violet-300">
                                        {roomCode || "Loading..."}
                                    </code>

                                    <button
                                        type="button"
                                        onClick={
                                            copyRoomCode
                                        }
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                                        title="Copy room code"
                                    >
                                        {copied ? (
                                            <Check
                                                size={
                                                    16
                                                }
                                                className="text-emerald-400"
                                            />
                                        ) : (
                                            <Copy
                                                size={
                                                    16
                                                }
                                            />
                                        )}
                                    </button>
                                </div>

                                {copied && (
                                    <p className="mt-2 text-xs text-emerald-400">
                                        Room code copied
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* ================================================== */}
            {/* MESSAGES */}
            {/* ================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-[850px] px-3 py-6 sm:px-6">
                    <div className="space-y-5">
                        {messages.map((item) => (
                            <div
                                key={item.id}
                                className="group flex items-start gap-3"
                            >
                                {/* Avatar */}
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-lg"
                                    style={{
                                        backgroundColor:
                                            randomColor(
                                                item.userId
                                            ),
                                    }}
                                >
                                    {item.admin.name
                                        .slice(0, 1)
                                        .toUpperCase()}
                                </div>

                                {/* Message */}
                                <div className="min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-semibold text-slate-100">
                                            {
                                                item
                                                    .admin
                                                    .name
                                            }
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

            {/* ================================================== */}
            {/* MESSAGE INPUT */}
            {/* ================================================== */}

            <MessageInput
                roomSlug={slug}
                onSendMessage={(message) => {
                    if (!roomId) {
                        console.error(
                            "Cannot send message: room is still loading"
                        );
                        return;
                    }

                    const clientId =
                        crypto.randomUUID();

                    const optimisticMessage: Message =
                    {
                        id: Date.now(),
                        clientId,
                        message,
                        userId:
                            session?.user?.id ??
                            "",
                        admin: {
                            name:
                                session?.user
                                    ?.name ??
                                "You",
                        },
                    };

                    setMessages((current) => [
                        ...current,
                        optimisticMessage,
                    ]);

                    const outgoingMessage = {
                        clientId,
                        message,
                    };

                    if (
                        socketRef.current
                            ?.readyState !==
                        WebSocket.OPEN
                    ) {
                        queuedMessagesRef.current.push(
                            outgoingMessage
                        );

                        return;
                    }

                    socketRef.current.send(
                        JSON.stringify({
                            type: "chat",
                            roomId,
                            ...outgoingMessage,
                        })
                    );
                }}
            />
        </div>
    );
}