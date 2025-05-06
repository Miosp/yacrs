import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./db";
import { customSession, genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 2,
    },
    database: prismaAdapter(client, {
        provider: 'sqlite'
    }),
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: 'zitadel',
                    pkce: true,
                    clientId: import.meta.env.YACRS_ZITADEL_CLIENT_ID,
                    clientSecret: import.meta.env.YACRS_ZITADEL_CLIENT_SECRET,
                    discoveryUrl: 'http://localhost:8080/.well-known/openid-configuration',
                    mapProfileToUser: (profile) => ({
                        id: profile.sub,
                        email: profile.email,
                        name: profile.name || profile.preferred_username,
                        image: profile.picture
                    }),
                    scopes: ['openid', 'email', 'profile']
                }
            ]
        })
    ]
})
