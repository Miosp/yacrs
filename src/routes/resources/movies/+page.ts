import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { deleteMovieSchema } from "./deleteMovieSchema";

export const load: PageLoad = async ({ parent, data }) => {
    await parent
    const deleteForm = await superValidate(zod(deleteMovieSchema))

    return {
        deleteForm,
        ...data
    }
};