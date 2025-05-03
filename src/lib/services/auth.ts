import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./db";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 2,
    },
    database: prismaAdapter(client, {
        provider: 'sqlite'
    })
})