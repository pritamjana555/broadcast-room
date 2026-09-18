'use client'
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RoomFormProps = {
    onCloseAction: () => void;
    onCreatedAction: (room: { id: number; slug: string }) => void;
};

export default function RoomForm({ onCloseAction, onCreatedAction }: RoomFormProps) {
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession()
    const router = useRouter()
    
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (status === "authenticated" && session?.user?.id) {
        const userId = session.user.id

        async function createRoom() {
            const roomSlug = slug.trim()
            if (!roomSlug) return

            try {
                setLoading(true);

                const res = await axios.post<{ roomId: number }>(`${process.env.NEXT_PUBLIC_API_URL}/createroom`, {
                    slug: roomSlug,
                    adminId: userId,
                })
                onCreatedAction({ id: res.data.roomId, slug: roomSlug })
                setSlug("")
                onCloseAction()
                router.push(`/room/${encodeURIComponent(roomSlug)}`)
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error("Failed to create room", error.response?.data?.message ?? error.message)
                } else {
                    console.error("Failed to create room", error)
                }
            } finally {
                setLoading(false)
            }
        }
        return (
            <div>
                <form onSubmit={(e)=> {
                    e.preventDefault()
                    createRoom()
                }}>
                    <input type="text" name="Room Name" placeholder="Club room" value={slug} id="" onChange={(e) => setSlug(e.target.value)} required ></input>
                    <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Room"}
                </button>
                </form>
            </div>
        )
    } else return null
}