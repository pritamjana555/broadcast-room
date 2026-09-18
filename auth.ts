import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: requiredEnv("AUTH_GOOGLE_ID"),
      clientSecret: requiredEnv("AUTH_GOOGLE_SECRET"),
    })
  ]
})