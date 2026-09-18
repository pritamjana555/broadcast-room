import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "Email",
            credentials: {
                identifier: {
                    label: "Email or name",
                    type: "text",
                    placeholder: "email or name",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
                    method: "POST",
                    body: JSON.stringify({
                        identifier: credentials?.identifier,
                        password: credentials?.password,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const user = await res.json();

                if (res.ok && user) {
                    return user.user;
                }

                throw new Error(user.message || "Invalid credentials");
            },
        }),
    ],

    pages: {
        signIn: "/login"
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-signin`, {
                        method: "POST",
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            googleId: account.providerAccountId,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const data = await res.json();

                    if (res.ok && data.user) {
                        user.id = data.user.id; // attach your DB's id, not Google's
                        return true;
                    }

                    console.error("google-signin backend error:", data);
                    return false;
                } catch (err) {
                    console.error("google-signin fetch failed:", err);
                    return false;
                }
            }

            return true; // credentials login already validated in authorize()
        },

        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
} satisfies AuthOptions

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

