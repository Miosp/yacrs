import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./db";
import { admin, genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
    baseURL: import.meta.env.BETTER_AUTH_URL || (
        import.meta.env.NODE_ENV === 'production'
            ? "http://localhost:3000"
            : "http://localhost:5173"
    ),
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
                    mapProfileToUser: (profile) => {
                        const isAdmin = profile["urn:zitadel:iam:org:project:roles"]?.["Admin"] !== undefined
                        return {
                            id: profile.sub,
                            email: profile.email,
                            name: profile.name || profile.preferred_username,
                            image: profile.picture,
                            role: isAdmin ? "admin" : "user",
                            banned: false,
                        }
                    },
                    overrideUserInfo: true,
                    scopes: ['openid', 'email', 'profile', 'urn:zitadel:iam:org:project:role:Admin']
                }
            ]
        }),
        admin()
    ]
})
