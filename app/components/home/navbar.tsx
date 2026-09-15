import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HomeNavbar() {
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
          <Link
            href="/api/auth/signin"
            className="login-link"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="get-started"
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}