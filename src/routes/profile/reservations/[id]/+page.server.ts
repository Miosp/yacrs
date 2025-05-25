import { getSession } from "$lib/auth/session";
import { client } from "$lib/services/db";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PaymentStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ parent, params, request }) => {
    await parent();
    const reservationId = parseInt(params.id);
    const user = await getSession(request.headers);

    if (!user) {
        throw error(401, "Unauthorized access");
    }

    const reservation = await client.reservation.findUnique({
        where: {
            id: reservationId
        },
        include: {
            seats: {
                include: {
                    auditorium: true
                }
            },
            screening: {
                include: {
                    movie: true,
                    auditorium: true
                }
            }
        }
    })

    if (!reservation) {
        throw error(404, "Reservation not found");
    }

    if (reservation.userId !== user.id) {
        throw error(403, "Unauthorized access to reservation");
    }

    return {
        reservation
    }
};

export const actions: Actions = {
    pay: async ({ request, params }) => {
        const reservationId = parseInt(params.id);

        const user = await getSession(request.headers);

        if (!user) {
            throw error(401, "Unauthorized access");
        }

        const reservation = await client.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        if (!reservation) {
            throw error(404, "Reservation not found");
        }

        if (reservation.userId !== user.id) {
            throw error(403, "Unauthorized access to reservation");
        }

        if (reservation.status !== PaymentStatus.RESERVED) {
            throw error(400, "Reservation not eligible for payment");
        }

        await client.reservation.update({
            where: { id: reservationId },
            data: { status: PaymentStatus.COMPLETED }
        });
    },
    refund: async ({ request, params }) => {
        const reservationId = parseInt(params.id);

        const user = await getSession(request.headers);

        if (!user) {
            throw error(401, "Unauthorized access");
        }

        const reservation = await client.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        if (!reservation) {
            throw error(404, "Reservation not found");
        }

        if (reservation.userId !== user.id) {
            throw error(403, "Unauthorized access to reservation");
        }

        if (reservation.status !== PaymentStatus.COMPLETED) {
            throw error(400, "Reservation not eligible for refund");
        }

        await client.reservation.update({
            where: { id: reservationId },
            data: { status: PaymentStatus.REFUNDED }
        });
    }
};