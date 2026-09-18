'use client'
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";


export function HomeNavbar() {
  const session = useSession()
  return (
    <header className="home-navbar">
      <div className="home-nav-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Chatroom home"
        >
          <span className="brand-icon">
            <MessageCircle
              size={18}
              strokeWidth={2}
            />
          </span>

          <span className="brand-name">
            chatroom
          </span>
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          <a href="#rooms">Explore</a>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#about">
            About
          </a>
        </nav>

        <div className="nav-actions">
          {session.status !== 'authenticated' ? <Link
            href="/api/auth/signin"
            className="login-link"
          >
            Log in
          </Link> :<button
                      type="button"
                      className="auth-logout-button"
                      onClick={() => signOut()}
                    >
                      Log out
                    </button>}

          {session.status !== 'authenticated' ?
            <Link
              href="/signup"
              className="get-started"
            >
              Get started
              <ArrowRight size={15} />
            </Link>
            :
            <div>{session.data.user.name}</div>
          }

        </div>
      </div>
    </header>
  );
}