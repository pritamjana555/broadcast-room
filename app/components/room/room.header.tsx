import { Bell, MessageCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RoomHeader(){
  const router = useRouter()
  const { data: session, status } = useSession()

  function randomColor(userId: string) {
        let hash = 0
        for (let index = 0; index < userId.length; index++) {
            hash = userId.charCodeAt(index) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;

        return `hsl(${hue}, 65%, 50%)`;
    }
    return <header className="flex h-[60px] sm:h-[72px]  shrink-0 items-center border-b border-white/[0.06] bg-[#111720] px-4 sm:px-6">

          {/* Logo */}

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-[0_6px_20px_rgba(124,58,237,0.3)]" style={{backgroundColor: randomColor(session?.user.id ?? "")}}>
              <MessageCircle
                size={22}
                strokeWidth={2.4} onClick={() => router.push('/')}
              />
            </div>

            <span className="hidden text-[21px] font-semibold tracking-tight sm:block cursor-pointer" onClick={() => router.push('/')}>
              chatroom
            </span>
          </div>

          {/* Search */}

          <div className="mx-auto hidden w-full max-w-[440px] md:block">
            <div className="flex h-10 items-center gap-3 rounded-full border border-white/[0.06] bg-[#191f2a] px-4">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search rooms or messages..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

            </div>
          </div>

          {/* Right */}

          <div className="ml-auto flex items-center gap-2">

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="mx-2 hidden h-6 w-px bg-white/[0.07] sm:block" />

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br  text-sm font-semibold" style={{backgroundColor: randomColor(session?.user.id ?? "")}}
            >
              {session?.user.name.charAt(0).toUpperCase()}

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111720] bg-emerald-500" />
            </button>

          </div>
        </header>
}