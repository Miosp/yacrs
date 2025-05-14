import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";
import { redirect } from "@sveltejs/kit";
import { client } from "$lib/services/db";
import { verifyAdminRights } from "$lib/auth/verifier";

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();
    verifyAdminRights(parentData.session);
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema))

        if (!form.valid) {
            return fail(400, { form })
        }

        const seats = Array.from({ length: form.data.columns * form.data.rows }, (_, i) => ({
            row: Math.floor(i / form.data.columns),
            seatNumber: i % form.data.columns
        }));

        await client.auditorium.create({
            data: {
                displayName: form.data.name,
                seats: {
                    createMany: {
                        data: seats
                    }
                }
            }
        })

        return redirect(303, "/resources/auditoriums")
    }
}