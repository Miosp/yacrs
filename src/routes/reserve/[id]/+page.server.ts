import type { PageServerLoad } from "./$types";
import { loadSeatData } from "./reservationUtils";

export const load: PageServerLoad = async ({ params, parent }) => {
    await parent();
    const screeningId = parseInt(params.id);
    const data = await loadSeatData(screeningId);

    return {
        id: screeningId,
        ...data
    }
};
