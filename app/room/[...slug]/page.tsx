"use client"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Room = {
    id: number
    slug: string
}
export default function Page() {
    const { data: session, status } = useSession()
    const params = useParams<{ slug: string[] }>()
    const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug
    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        if (status !== "authenticated" || !session.user?.id) {
            setRooms([])
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
    })
    return <div>
        <header># broadcast</header>
        <h1>
            Welcome to {slug.replace("%20"," ")}
        </h1>
        <h3>This is the beginning of this room.</h3>
        <main>

        </main>
        <footer>
            <input type="text" placeholder="Message" ></input>
        </footer>

    </div>
}