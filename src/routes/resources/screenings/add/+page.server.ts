import { fail, setError, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { screeningAddSchema } from "./screeningAddSchema";
import { zod } from "sveltekit-superforms/adapters";
import { client } from "$lib/services/db";
import { redirect } from "@sveltejs/kit";
import { verifyAdminRights } from "$lib/auth/verifier";

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    // Fetch all movies for the dropdown
    const movies = await client.movie.findMany({
        select: { id: true, title: true }
    });

    return { movies };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(screeningAddSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const movie = await client.movie.findUnique({
            where: {
                id: form.data.movieId
            }
        })

        if (!movie) {
            return setError(form, "movieId", "Movie with this ID not found");
        }

        const auditorium = await client.auditorium.findUnique({
            where: {
                id: form.data.auditoriumId
            }
        })

        if (!auditorium) {
            return setError(form, "auditoriumId", "Auditorium with this ID not found");
        }

        const startTime = new Date(form.data.dateTime);

        await client.screening.create({
            data: {
                startTime,
                auditoriumId: form.data.auditoriumId,
                movieId: form.data.movieId,
            }
        })

        return redirect(303, '/resources/screenings');
    }
};