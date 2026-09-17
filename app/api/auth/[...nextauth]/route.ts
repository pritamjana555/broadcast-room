import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
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
                const res = await fetch("http://localhost:5000/api/auth/signin", {
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

