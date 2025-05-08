import { adminClient, genericOAuthClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/svelte"
export const { signIn, signUp, useSession, signOut } = createAuthClient({
    plugins: [
        genericOAuthClient(),
        adminClient()
    ]
})
