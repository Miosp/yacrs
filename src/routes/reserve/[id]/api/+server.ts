import { reservationEmitter } from "$lib/server/messageQueueExample";
import { loadReservedSeatIds } from "../reservationUtils";
import type { RequestHandler } from "./$types";
import { produce } from 'sveltekit-sse';

async function handleReservationChange(id: number) {
    const newSeating = await loadReservedSeatIds(id);
    return JSON.stringify(newSeating);
}

export const POST: RequestHandler = async ({ params }) => {
    const { id: rawId } = params;
    const id = parseInt(rawId);

    if (isNaN(id)) {
        return new Response('Invalid ID', { status: 400 });
    }


    return produce(async function start({ emit }) {
        const reservationHandler = async () => emit('changed', await handleReservationChange(id));

        reservationEmitter.on(rawId, reservationHandler);

        return () => {
            reservationEmitter.off(rawId, reservationHandler);
        }
    })
};
