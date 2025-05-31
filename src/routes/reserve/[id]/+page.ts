import type { PageLoad } from "./$types";
import { transformSeatData } from "./reservationUtils";

export const load: PageLoad = async ({ parent, params, data }) => {
    await parent();
    const screeningId = parseInt(params.id);

    const transformedSeatData = await transformSeatData(data)

    return {
        screeningId,
        ...transformedSeatData
    }
};
