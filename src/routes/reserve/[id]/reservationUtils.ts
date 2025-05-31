import { client } from "$lib/services/db";
import { PaymentStatus } from "@prisma/client";
import { error } from "@sveltejs/kit";

export function encodeReserveList(seats: number[]): string {
    return btoa(JSON.stringify(seats));
}

export function decodeReserveList(encoded: string): number[] {
    const json = atob(encoded);
    return JSON.parse(json);
}

export async function loadSeatData(id: number) {
    const screening = await client.screening.findUnique({
        where: {
            id
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
    });

    if (!screening) {
        throw error(404, "Screening not found");
    }

    if (screening.startTime < new Date()) {
        throw error(400, "Screening is in the past, you cannot reserve seats for it.");
    }

    const seatList = screening.auditorium.seats.map(seat => ({
        id: seat.id,
        row: seat.row,
        number: seat.seatNumber,
    }));

    const reservedSeats = screening.reservations.filter(reservation => reservation.status !== PaymentStatus.REFUNDED)
        .flatMap(reservation =>
            reservation.seats.map(seat => ({
                id: seat.id,
                row: seat.row,
                number: seat.seatNumber,
            }))
        );

    return {
        auditoriumName: screening.auditorium.displayName,
        startTime: screening.startTime,
        movie: screening.movie,
        seatList,
        reservedSeats
    }
}

export async function loadReservedSeatIds(id: number): Promise<number[]> {
    const reservations = await client.reservation.findMany({
        where: {
            screeningId: id,
            status: {
                not: PaymentStatus.REFUNDED
            }
        },
        select: {
            seats: {
                select: {
                    id: true
                }
            }
        }
    })

    return reservations.flatMap(reservation => reservation.seats.map(seat => seat.id));
}

type LoadedSeatData = Awaited<ReturnType<typeof loadSeatData>>;

export type SeatViewerView = {
    id: number;
    reserved: boolean;
}

export async function transformSeatData(data: LoadedSeatData) {
    const roomWidth = data.seatList.reduce((max, seat) => Math.max(max, seat.row), 0);
    const roomHeight = data.seatList.reduce((max, seat) => Math.max(max, seat.number), 0);

    const seats: (SeatViewerView | undefined)[][] = Array(roomWidth + 1)
        .fill(null)
        .map(() => Array(roomHeight + 1).fill(undefined));

    for (const seat of data.seatList) {
        seats[seat.row][seat.number] = {
            id: seat.id,
            reserved: false
        };
    }

    for (const reservedSeat of data.reservedSeats) {
        if (seats[reservedSeat.row]?.[reservedSeat.number]) {
            seats[reservedSeat.row][reservedSeat.number]!.reserved = true;
        }
    }

    const auditoriumSeats = data.seatList.map(seat => ({
        id: seat.id,
        row: seat.row,
        seatNumber: seat.number
    }));

    const reservedSeatIds = data.reservedSeats.map(seat => seat.id);

    return {
        roomHeight,
        roomWidth,
        seats,
        roomName: data.auditoriumName,
        startTime: data.startTime,
        movie: data.movie,
        auditoriumSeats,
        reservedSeatIds
    };
}