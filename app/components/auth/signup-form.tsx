"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <span className="mobile-auth-brand">chatroom</span>

        <span className="auth-form-eyebrow">GET STARTED</span>

        <h2>Create your account.</h2>

        <p>Find your people. Start the conversation.</p>
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
          disabled={loading}
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