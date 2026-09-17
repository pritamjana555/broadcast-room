'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import LoginButton from "./Loginbutton"
import LogoutButton from "./logoutbutton"
import SignupButton from "./Signupbutton"
import RoomForm from "./roomForm"
import axios from "axios"

type Room = {
  id: number
  slug: string
}

export function AppSidebar() {
  const { data: session, status } = useSession()
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])

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
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 text-lg font-semibold">Draw App</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            {status === "authenticated" ? (
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <div><LogoutButton /></div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div><LoginButton /></div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div><SignupButton /></div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {status === "authenticated" && (
          <SidebarGroup>
            <SidebarGroupLabel>Rooms</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  onClick={() => setIsRoomFormOpen(true)}
                >
                  Create Room
                </SidebarMenuButton>
              </SidebarMenuItem>
              {rooms.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <SidebarMenuButton>
                    <a href={`/room/${encodeURIComponent(room.slug)}`}>{room.slug}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {rooms.length === 0 && (
                <li className="px-2 py-1 text-sm text-muted-foreground">
                  No rooms yet
                </li>
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />

      {isRoomFormOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/45"
          role="presentation"
          onClick={() => setIsRoomFormOpen(false)}
        >
          <div
            className="w-[min(92vw,28rem)] rounded-lg bg-white p-6 text-black"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-room-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="create-room-title" className="font-semibold">Create Room</h2>
              <button type="button" onClick={() => setIsRoomFormOpen(false)} aria-label="Close">
                X
              </button>
            </div>
            <RoomForm
              onCloseAction={() => setIsRoomFormOpen(false)}
              onCreatedAction={(room) => setRooms((currentRooms) => [...currentRooms, room])}
            />
          </div>
        </div>
      )}
    </Sidebar>
  )
}