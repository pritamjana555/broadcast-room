"use client";

import { Plus, Send, Smile } from "lucide-react";
import { useState } from "react";

type MessageInputProps = {
  roomSlug: string;
  onSendMessage: (message: string) => void;
};

export default function MessageInput({
  roomSlug,
  onSendMessage,
}: MessageInputProps) {
  const [message, setMessage] = useState("")

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    onSendMessage(trimmed);
    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="shrink-0">
      <div className="shrink-0 border-t border-white/[0.05] bg-[#10161f] p-3 sm:p-4">

              <div className="mx-auto flex max-w-[850px] items-center gap-2 rounded-xl border border-white/[0.07] bg-[#191f2a] px-2 py-2">

                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {/* <Plus size={18} /> */}
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={`Message #${roomSlug.replaceAll("%20","")}`}
                  className="min-w-0 flex-1 bg-transparent px-2 text-base sm:text-sm text-white outline-none placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send
                    size={16}
                    className="-rotate-6"
                  />
                </button>

              </div>

            </div>

    </section>
  );
}