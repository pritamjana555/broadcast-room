"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AuthScene } from "./auth-scene";

export function AuthShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "signup";
}) {
  return (
    <main className="auth-page">
      {/* LEFT 60% */}
      <section className="auth-visual">
        <AuthScene />

        <Link href="/" className="auth-brand">
          <span className="auth-brand-icon">
            <MessageCircle size={18} strokeWidth={2} />
          </span>

          <span>chatroom</span>
        </Link>

        <div className="auth-visual-content">
          <span className="auth-eyebrow">
            {mode === "login" ? "WELCOME BACK" : "JOIN THE CONVERSATION"}
          </span>

          <h1>
            {mode === "login" ? (
              <>
                Good conversations
                <br />
                are worth coming back to.
              </>
            ) : (
              <>
                There&apos;s always
                <br />
                room for <span>one more.</span>
              </>
            )}
          </h1>

          <p>
            {mode === "login"
              ? "Jump back into the rooms, people and conversations waiting for you."
              : "Create your account and find people who are interested in the things you care about."}
          </p>
        </div>

        <div className="auth-visual-footer">
          <span className="auth-status-dot" />
          <span>Conversations are happening right now</span>
        </div>
      </section>

      {/* RIGHT 40% */}
      <section className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </section>
    </main>
  );
}