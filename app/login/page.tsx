'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import { AuthShell } from "../components/auth/auth-shell";
import { LoginForm } from "../components/auth/login-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react"

export default function LoginPage() {
  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Email or name"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">Login</button>

      <h6>Dont't have an account? <Link href={'/signup'} className="text-blue-400 underline italic">Sign up</Link></h6>

      {error && <p>{error}</p>}
    </form>
  );
}