import { signOut } from "$lib/services/user/auth";
import type { Actions } from "./$types"

export const actions: Actions = { default: signOut }
