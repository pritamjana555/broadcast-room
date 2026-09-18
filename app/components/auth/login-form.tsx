"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
            onClick={() => router.push("/room")}
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
        router.push("/room");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/room" });
    } catch {
      setError("Unable to log in with Google. Please try again.");
      setGoogleLoading(false);
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

      <button
        type="button"
        className="auth-google-btn"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="auth-spinner" size={17} />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <div className="auth-divider">
        <span />
        <small>OR</small>
        <span />
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
          disabled={loading || googleLoading}
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

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <Link href="/signup">Create one</Link>
      </p>
    </div>
  );
}