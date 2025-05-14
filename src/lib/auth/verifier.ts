import { error } from "@sveltejs/kit";
import type { getSession } from "./session";

export function verifyAdminRights(
    session: Awaited<ReturnType<typeof getSession>>
) {
    if (session?.role !== "admin") {
        throw error(403, "You do not have permission to access this page");
    }
}
