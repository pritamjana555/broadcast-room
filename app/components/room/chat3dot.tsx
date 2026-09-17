import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Chat3dot(){
    const router = useRouter()
    return <div className="h-max w-max bg-[#191f2a] rounded-[10%]" onClick={() => router.push("/room")}>
        <li className="p-1">
            <ul className="flex row gap-2"><X/><span>Close chat</span></ul>
        </li>
    </div>
}