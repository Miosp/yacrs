import { client } from "$lib/services/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PaymentStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ params }) => {
    const screeningId = parseInt(params.id);

    const screening = await client.screening.findUnique({
        where: {
            id: screeningId
        },
        include: {
            movie: true,
            auditorium: {
                include: {
                    seats: true
                }
            },
            reservations: {
                include: {
                    seats: true
                }
            }
        }
    })

    if (!screening) {
        return error(404, "Screening not found");
    }

    if (screening.startTime < new Date()) {
        return error(400, "Screening is in the past, you cannot reserve seats for it.");
    }

    const seatList = screening.auditorium.seats.map(seat => ({
        id: seat.id,
        row: seat.row,
        number: seat.seatNumber,
    }))

    const reservedSeats = screening.reservations.filter(reservation => reservation.status !== PaymentStatus.REFUNDED)
        .flatMap(reservation =>
            reservation.seats.map(seat => ({
                id: seat.id,
                row: seat.row,
                number: seat.seatNumber,
            }))
        );

    return {
        id: screening.id,
        audtoriumName: screening.auditorium.displayName,
        startTime: screening.startTime,
        movie: screening.movie,
        seats: seatList,
        reserved: reservedSeats
    }
};
