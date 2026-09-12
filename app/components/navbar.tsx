'use client'
import { useSession } from "next-auth/react"
import LoginButton from "./Loginbutton"
import LogoutButton from "./logoutbutton"
import SignupButton from "./Signupbutton"

export default function Navbar() {
    const session = useSession()

    return <div>
        navbar
        {session.status === "authenticated" ? <div>
            <LogoutButton />
        </div> :

            <div>
                <LoginButton /> <br /> <SignupButton />
            </div>}
    </div>
}