import { client } from "$lib/services/db";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { schema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { verifyAdminRights } from "$lib/auth/verifier";

export const load: PageServerLoad = async ({ parent, depends }) => {
    depends("app:auditoriums")
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    return {
        auditoriums: await client.auditorium.findMany()
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema))

        if (!form.valid) {
            return fail(400, { form })
        }

        const res = await client.auditorium.delete({
            where: {
                id: form.data.id
            },
            include: {
                seats: true,
                screenings: true
            }
        })

        return { success: true, res };
    }
};
