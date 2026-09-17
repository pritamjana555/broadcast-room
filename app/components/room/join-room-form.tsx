"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

type JoinRoomFormProps = {
  onJoinedAction: () => void;
};


export default function JoinRoomForm({
  onJoinedAction,
}: JoinRoomFormProps) {
  const [shareCode, setShareCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  async function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status !== "authenticated" || !session?.user?.id) {
      setError("You must be logged in");
      return;
    }

    const trimmedShareCode = shareCode.trim();

    if (!trimmedShareCode) {
      setError("Enter a room share code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post<{
        message: string;
        room: {
          id: number;
          slug: string;
          shareCode: string;
        };
      }>("http://localhost:5000/joinroom", {
        shareCode: trimmedShareCode,
        userId: session.user.id,
      });

      const joinedRoom = response.data.room;

      setShareCode("");
      onJoinedAction()
      router.push(`/room/${encodeURIComponent(joinedRoom.slug)}`);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ?? "Could not join room"
        );
      } else {
        setError("Could not join room");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={joinRoom} className="space-y-4">
      <input
        type="text"
        placeholder="Enter share code"
        value={shareCode}
        onChange={(event) => setShareCode(event.target.value)}
        required
      />

      {error && <p className="text-red-400">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Joining..." : "Join room"}
      </button>
    </form>
  );
}