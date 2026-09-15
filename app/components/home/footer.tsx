import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function HomeFooter() {
  return (
    <footer
      id="about"
      className="home-footer"
    >
      <div className="footer-inner">
        <div className="footer-brand">
          <Link
            href="/"
            className="brand"
          >
            <span className="brand-icon">
              <MessageCircle size={17} />
            </span>

            <span className="brand-name">
              chatroom
            </span>
          </Link>

          <p>
            A simple place for conversations
            around the things you care about.
          </p>
        </div>

        <div className="footer-links">
          <a href="#rooms">
            Explore
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <Link href="/api/auth/signin">
            Log in
          </Link>

          <Link href="/signup">
            Sign up
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Chatroom
        </span>

        <span>
          Built for conversations.
        </span>
      </div>
    </footer>
  );
}