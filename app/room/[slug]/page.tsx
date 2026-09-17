"use client"
import Chat3dot from "@/app/components/room/chat3dot"
import MessageInput from "@/app/components/room/message-input-box"
import axios from "axios"
import { Hash, Info, MoreHorizontal, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Room = {
    id: number
    slug: string
}

type Message = {
    id: number
    message: string
    userId: string
    admin: {
        name: string
    }
    clientId?: string
};

export default function Page() {
    const { data: session, status } = useSession()
    const params = useParams<{ slug: string[] }>()
    const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug
    const [rooms, setRooms] = useState<Room[]>([])
    const [roomId, setRoomId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [membersOpen, setMembersOpen] = useState(false);
    const [color, setColor] = useState("rgba(255, 0, 0, 1)");
    const socketRef = useRef<WebSocket | null>(null)
    const queuedMessagesRef = useRef<Array<{ clientId: string; message: string }>>([])


    useEffect(() => {
        if (!slug) return

        async function getRoom() {
            try {
                const response = await axios.get<{ room: Room | null }>(
                    `http://localhost:5000/room/${encodeURIComponent(slug)}`
                )
                setRoomId(response.data.room?.id ?? null)
            } catch (error) {
                console.error("Failed to fetch room", error)
                setRoomId(null)
            }
        }

        getRoom()
    }, [slug])  

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
    }, [session?.user?.id, status])

    useEffect(() => {
        if (!roomId) return;

        const socket = new WebSocket("ws://localhost:8081");
        socketRef.current = socket;

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId,
            }));

            queuedMessagesRef.current.forEach((queuedMessage) => {
                socket.send(JSON.stringify({
                    type: "chat",
                    roomId,
                    ...queuedMessage,
                }));
            });
            queuedMessagesRef.current = [];
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "error") {
                console.error("Chat server error:", data.message)
                return
            }

            if (data.type === "chat") {
                setMessages((current) => {
                    const incomingMessage = data as Message;
                    const optimisticIndex = current.findIndex(
                        (message) => message.clientId && message.clientId === incomingMessage.clientId
                    );

                    if (optimisticIndex === -1) {
                        return [...current, incomingMessage];
                    }

                    const nextMessages = [...current];
                    nextMessages[optimisticIndex] = incomingMessage;
                    return nextMessages;
                });
            }
        };

        socket.onerror = (event) => {
            console.error("WebSocket connection failed:", event)
        }

        socket.onclose = (event) => {
            console.log("WS closed:", event.code, event.reason)
            if (socketRef.current === socket) {
                socketRef.current = null
            }
        }

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "leave-room",
                    roomId,
                }));
            }
            socket.close();
            socketRef.current = null;
        };
    }, [roomId]);

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await axios.get<{ messages: Message[] }>(`http://localhost:5000/chats/${encodeURIComponent(slug)}`)

                setMessages(response.data.messages)
            } catch (error) {
                console.error("Failed to fetch messages: ", error)
            }
        }
        if (slug) getMessages()
    }, [slug, socketRef])

    function randomColor(userId: string) {
        let hash = 0
        for (let index = 0; index < userId.length; index++) {
            hash = userId.charCodeAt(index) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;

        return `hsl(${hue}, 65%, 50%)`;
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <Hash size={23} className="shrink-0 text-slate-500" />
                    <div className="min-w-0">
                        <h2 className="truncate text-[17px] font-semibold">{decodeURIComponent(slug)}</h2>
                        <div className="flex items-center gap-2">
                            {roomId !== null && (
                                <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-500">
                                        Room is active
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setMembersOpen(!membersOpen)}
                        className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition ${membersOpen
                            ? "bg-violet-500/10 text-violet-300"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                            }`}
                    >
                        <Users size={17} />
                        <span className="hidden sm:inline">0</span>
                    </button>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                        <Info size={18} />
                    </button>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                        <MoreHorizontal size={18} />
                        <Chat3dot/>
                    </button>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-[850px] px-4 py-6 sm:px-6">
                    <div className="space-y-5">
                        {messages.map((item) => (
                            <div key={item.id} className="group flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center  rounded-full  text-sm font-semibold shadow-lg" style={{ backgroundColor: randomColor(item.userId) }}>
                                    {item.admin.name.slice(0, 1).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-semibold text-slate-100">{item.admin.name}</span>
                                    </div>
                                    <p className="mt-0.5 break-words text-sm leading-6 text-slate-300">{item.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MessageInput roomSlug={slug}
                onSendMessage={(message) => {
                    if (!roomId) {
                        console.error("Cannot send message: room is still loading")
                        return;
                    }

                    const clientId = crypto.randomUUID();
                    const optimisticMessage: Message = {
                        id: Date.now(),
                        clientId,
                        message,
                        userId: session?.user?.id ?? "",
                        admin: {
                            name: session?.user?.name ?? "You",
                        },
                    };

                    setMessages((current) => [...current, optimisticMessage]);

                    const outgoingMessage = { clientId, message };
                    if (socketRef.current?.readyState !== WebSocket.OPEN) {
                        queuedMessagesRef.current.push(outgoingMessage);
                        return;
                    }

                    socketRef.current.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        ...outgoingMessage,
                    }));
                }} />
        </div>
    )
}