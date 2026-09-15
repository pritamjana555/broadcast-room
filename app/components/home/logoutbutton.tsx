'use client'
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutButton(){
    const router = useRouter()
    return <div onClick={() => {
        signOut()
        router.push('/')
    }}>Logout</div>
}