import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { reservationSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageLoad = async ({ parent, data }) => {
    await parent();

    const initFormData = {
        screeningId: data.screening.id,
        seats: data.seats.map(seat => seat.id) as [number, ...number[]]
    }

    const reservationForm = await superValidate(initFormData, zod(reservationSchema), {
        id: "reservationForm"
    });
    const purchaseForm = await superValidate(initFormData, zod(reservationSchema), {
        id: "purchaseForm"
    });

    return {
        seats: data.seats,
        screening: data.screening,
        reservationForm,
        purchaseForm,
    }
};