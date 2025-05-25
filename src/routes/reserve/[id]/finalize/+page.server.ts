import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { decodeReserveList } from "../reservationUtils";
import { client } from "$lib/services/db";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { reservationSchema } from "./schema";
import { PaymentStatus } from "@prisma/client";
import { getSession } from "$lib/auth/session";

export const load: PageServerLoad = async ({ parent, params, url }) => {
    await parent();
    const screeningId = parseInt(params.id);

    if (isNaN(screeningId)) {
        throw error(400, "Invalid screening ID");
    }

    const encodedSeats = url.searchParams.get("seats");
    if (!encodedSeats) {
        throw error(400, "No seats selected for reservation");
    }

    let seats: number[]
    try {
        seats = decodeReserveList(encodedSeats);
    } catch (err) {
        throw error(400, "Invalid seats data");
    }

    if (seats.length === 0) {
        throw error(400, "No seats selected for reservation");
    }

    const fetchedSeats = await client.seat.findMany({
        where: {
            id: {
                in: seats
            }
        }
    })

    if (fetchedSeats.length !== seats.length) {
        throw error(404, "Some selected seats do not exist");
    }

    const screening = await client.screening.findUnique({
        where: {
            id: screeningId
        },
        include: {
            movie: true,
            auditorium: true
        }
    })

    if (!screening) {
        throw error(404, "Screening not found");
    }

    return {
        screening,
        seats: fetchedSeats
    }
};

export const actions: Actions = {
    complete: async ({ request }) => reserveSeats(request, PaymentStatus.COMPLETED),
    reserve: async ({ request }) => reserveSeats(request, PaymentStatus.RESERVED),
};

async function reserveSeats(request: Request, status: PaymentStatus) {
    const form = await superValidate(request, zod(reservationSchema));
    const user = await getSession(request.headers);

    if (!form.valid || !user) {
        return { form };
    }

    const pricePerSeat = await client.screening.findUnique({
        where: {
            id: form.data.screeningId
        },
        include: {
            auditorium: {
                select: {
                    seatPrice: true
                }
            }
        }
    }).then(screening => screening?.auditorium.seatPrice);

    if (form.data.seats.length === 0) {
        return error(400, "No seats selected for reservation");
    }

    if (pricePerSeat === undefined) {
        return error(404, "Screening or auditorium not found");
    } const price = pricePerSeat.times(form.data.seats.length);

    const existingReservations = await client.reservation.findMany({
        where: {
            screeningId: form.data.screeningId,
            status: {
                not: PaymentStatus.REFUNDED
            }
        },
        include: {
            seats: {
                select: {
                    id: true
                }
            }
        }
    });

    const occupiedSeatIds = new Set(
        existingReservations.flatMap(reservation =>
            reservation.seats.map(seat => seat.id)
        )
    );

    const conflictingSeats = form.data.seats.filter(seatId =>
        occupiedSeatIds.has(seatId)
    );

    if (conflictingSeats.length > 0) {
        return message(form, "Some of the selected seats are already occupied. Please select different seats.", { status: 400 });
    }

    const res = await client.reservation.create({
        data: {
            screeningId: form.data.screeningId,
            totalPrice: price,
            userId: user?.id,
            seats: {
                connect: form.data.seats.map(seatId => ({ id: seatId }))
            },
            status: status
        }
    })

    return redirect(303, `/profile/reservations/${res.id}`);
}