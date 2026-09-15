import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type Room = {
  id: string;
  name: string;
  icon: string;
  category: string;
  online: number;
  message: string;
};

export function RoomCard({
  room,
}: {
  room: Room;
}) {
  return (
    <article className="room-card">
      <div className="room-card-top">
        <div className="room-info">
          <div className="room-icon">
            {room.icon}
          </div>

          <div>
            <h3>{room.name}</h3>

            <p>{room.category}</p>
          </div>
        </div>

        <div className="room-live">
          <span className="online-dot" />

          LIVE
        </div>
      </div>

      <div className="room-preview">
        <div className="preview-message-icon">
          💬
        </div>

        <div className="preview-content">
          <span>
            Latest conversation
          </span>

          <p>
            {room.message}
          </p>
        </div>
      </div>

      <div className="room-card-bottom">
        <span className="people-count">
          <span className="online-dot" />

          {room.online} people talking
        </span>

        <Link
          href="/api/auth/signin"
          className="room-join"
        >
          Join

          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}