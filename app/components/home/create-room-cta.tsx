import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "./reveal";

export function CreateRoomCTA() {
  return (
    <section className="cta-section">
      <Reveal>
        <div className="cta-card">
          <div className="cta-content">
            <span className="section-eyebrow">
              CREATE SOMETHING
            </span>

            <h2>
              Start a conversation
              <br />
              of your own.
            </h2>

            <p>
              Create a room, invite people and
              make a place for the topic you
              want to talk about.
            </p>

            <Link
              href="/signup"
              className="cta-button"
            >
              Create your room

              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div
            className="cta-orbit"
            aria-hidden="true"
          >
            <div className="cta-orb cta-orb-one">
              💬
            </div>

            <div className="cta-orb cta-orb-two">
              ✦
            </div>

            <div className="cta-orb cta-orb-three">
              👋
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}