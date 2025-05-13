import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { movieSchema } from "./schema";

export const load: PageLoad = async ({ parent }) => {
    await parent
    const movieForm = await superValidate(zod(movieSchema))

    return {
        movieForm,
    }
};
