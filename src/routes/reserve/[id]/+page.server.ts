import { client } from "$lib/services/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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

    const seatList = screening.auditorium.seats.map(seat => ({
        id: seat.id,
        row: seat.row,
        number: seat.seatNumber,
    }))

    const reservedSeats = screening.reservations.flatMap(reservation =>
        reservation.seats.map(seat => ({
            id: seat.id,
            row: seat.row,
            number: seat.seatNumber,
        }))
    );

    const screeningData = {
        id: screening.id,
        audtoriumName: screening.auditorium.displayName,
        startTime: screening.startTime,
        movie: screening.movie,
        seats: seatList,
        reserved: reservedSeats
    }

    return {
        screening: screeningData,
    }
};