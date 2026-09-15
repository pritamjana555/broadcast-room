import {
  RoomCard,
  type Room,
} from "./room-card";

import { Reveal } from "./reveal";

const rooms: Room[] = [
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    category: "Games & entertainment",
    online: 128,
    message:
      "Anyone playing tonight?",
  },

  {
    id: "technology",
    name: "Technology",
    icon: "💻",
    category: "Tech & development",
    online: 64,
    message:
      "What's everyone building?",
  },

  {
    id: "music",
    name: "Music",
    icon: "🎵",
    category: "Music & artists",
    online: 42,
    message:
      "What are you listening to?",
  },
];

export function LiveRooms() {
  return (
    <section
      id="rooms"
      className="rooms-section"
    >
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              EXPLORE
            </span>

            <h2>
              Conversations happening now.
            </h2>
          </div>

          <p>
            Drop into a room and see what
            people are talking about before
            you join.
          </p>
        </div>
      </Reveal>

      <div className="rooms-grid">
        {rooms.map(
          (room, index) => (
            <Reveal
              key={room.id}
              delay={index * 80}
            >
              <RoomCard room={room} />
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}