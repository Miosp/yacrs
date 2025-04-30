import { PrismaAdapter } from "@auth/prisma-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: PrismaAdapter(client),
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {

                return null;
            }
        })
    ]
})
