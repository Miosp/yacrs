import { PrismaAdapter } from "@auth/prisma-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { verifyUser } from "./verify";

const client = new PrismaClient();

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: PrismaAdapter(client),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Credentials({
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            authorize: async (credentials) => {
                const { username, password } = credentials as {
                    username?: string;
                    password?: string;
                };

                return (await verifyUser(username, password)).unwrapOr(null);
            }
        })
    ],
    trustHost: true,
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                //@ts-ignore
                const username = user.name || (user.username as string | undefined);
                token.id = user.id;
                token.name = username;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
});
