"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session) {
    return <button onClick={() => signOut()}>Logout</button>;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email/username or password");
    } else if (result?.ok) {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Email or username"
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

      {error && <p>{error}</p>}
    </form>
  );
}