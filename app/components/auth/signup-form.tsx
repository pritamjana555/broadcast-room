"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

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

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          email,
          name,
          password,
        }
      );

      if (res.status) {
        router.push("/login");
      } else {
        setError("Unable to create your account.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Unable to sign up with Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <span className="mobile-auth-brand">chatroom</span>

        <span className="auth-form-eyebrow">GET STARTED</span>

        <h2>Create your account.</h2>

        <p>Find your people. Start the conversation.</p>
      </div>

      <button
        type="button"
        className="auth-google-btn"
        onClick={handleGoogleSignup}
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
        <span>or sign up with email</span>
      </div>

      <form onSubmit={handleSignup} className="auth-form">
        <div className="auth-field">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            placeholder="What should we call you?"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>

          <div className="password-input">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <p className="auth-terms">
        By creating an account, you&apos;re joining the Chatroom community.
      </p>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}