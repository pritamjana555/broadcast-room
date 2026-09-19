"use client";

import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Search,
} from "lucide-react";

import { HeroScene } from "./hero-scene";
import axios from "axios";
import { useSession } from "next-auth/react";

export function Hero() {
  async function joinRoom() {
    await axios.post("")
  }
  const { data: session, status } = useSession()
  return (
    <section className="hero-section">
      <div className="hero-background" />



      <HeroScene />

      <div className="hero-content">
        <div className="hero-live">
          <span className="online-dot" />

          2,481 people talking right now
        </div>

        <h1 className="hero-title">
          Talk about anything.
          <br />

          <span>
            Find people who get it.
          </span>
        </h1>

        <p className="hero-description">
          Chatrooms for interests, ideas and
          conversations that actually matter.
        </p>

        <div className="hero-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search rooms, topics, or communities..."
            aria-label="Search rooms, topics, or communities"
          />

          <span className="search-shortcut">
            ⌘ K
          </span>
        </div>

        <div className="hero-actions">
          {status === "authenticated" ? <Link
            href={"/room"}
            className="primary-action"
            onClick={() => joinRoom()}
          >
            Join room by code

            <ArrowRight size={17} />
          </Link>
            :
            <Link
              href="#rooms"
              className="primary-action"
              onClick={() => joinRoom()}
            >
              Join room by code

              <ArrowRight size={17} />
            </Link>
          }
          {status === "authenticated" ?
          <Link
            href="/room"
            className="secondary-action"
          >
            <Plus size={17} />

            Create a room
          </Link>
          :
          <Link
            href="/signup"
            className="secondary-action"
          >
            <Plus size={17} />

            Create a room
          </Link>
}
        </div>
      </div>


      <a
        className="scroll-cue"
        href="#rooms"
      >
        <span>
          Scroll to explore
        </span>

        <ArrowRight size={15} />
      </a>
    </section>
  );
}