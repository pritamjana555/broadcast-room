import Link from "next/link";

export default function LoginButton(){
    return <Link href={'/api/auth/signin'}>Login</Link>
}