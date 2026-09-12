'use client'
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

type RoomFormProps = {
    onClose: () => void;
    onCreated: (room: { id: number; slug: string }) => void;
};

export default function RoomForm({ onClose, onCreated }: RoomFormProps) {
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession()
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (status === "authenticated") {
        async function createRoom() {
            try {
                setLoading(true);
                console.log(session);
                
                const adminId = session?.user?.id
                console.log(adminId);
                
                const res = await axios.post("http://localhost:5000/room", {
                    slug,
                    adminId
                })
                console.log("Room created: ", res.data);
                onCreated({ id: res.data.roomId, slug })
                setSlug("")
                onClose()
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data);
                } else {
                    console.log(error);
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