"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (session) {
    return (
      <div className="already-authenticated">
        <div className="success-icon">✓</div>

        <h2>You&apos;re already signed in.</h2>

        <p>
          You&apos;re already part of the conversation. Continue to the
          chatroom or sign out.
        </p>

        <div className="authenticated-actions">
          <button
            type="button"
            className="auth-submit"
            onClick={() => router.push("/")}
          >
            Continue to chatroom
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={() => signOut()}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email/name or password");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <span className="mobile-auth-brand">chatroom</span>

        <span className="auth-form-eyebrow">WELCOME BACK</span>

        <h2>Log in to chatroom.</h2>

        <p>Continue where you left off.</p>
      </div>

      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-field">
          <label htmlFor="identifier">Email or name</label>

          <input
            id="identifier"
            type="text"
            placeholder="Enter your email or name"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="password">Password</label>

            <Link href="#" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <div className="password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="auth-spinner" size={17} />
              Logging in...
            </>
          ) : (
            <>
              Log in
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span />
        <small>OR</small>
        <span />
      </div>

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <Link href="/signup">Create one</Link>
      </p>
    </div>
  );
}