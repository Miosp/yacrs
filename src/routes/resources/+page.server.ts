import { verifyAdminRights } from "$lib/auth/verifier";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();
    verifyAdminRights(parentData.session);
};
