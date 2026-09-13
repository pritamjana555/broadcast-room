'use client'
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RoomFormProps = {
    onClose: () => void;
    onCreated: (room: { id: number; slug: string }) => void;
};

export default function RoomForm({ onClose, onCreated }: RoomFormProps) {
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
            try {
                setLoading(true);

                const res = await axios.post<{ roomId: number }>("http://localhost:5000/createroom", {
                    slug,
                    adminId: userId
                })
                onCreated({ id: res.data.roomId, slug })
                setSlug("")
                router.push(`http://localhost:3000/room/${slug}`)
                onClose()
            } catch (error) {
                console.error("Failed to create room", error)
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