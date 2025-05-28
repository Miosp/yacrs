import type { PageLoad } from "./$types";

export type SeatViewerView = {
    id: number;
    reserved: boolean;
}

export const load: PageLoad = async ({ parent, data }) => {
    await parent();

    const roomWidth = data.seats.reduce((max, seat) => Math.max(max, seat.row), 0);
    const roomHeight = data.seats.reduce((max, seat) => Math.max(max, seat.number), 0);

    const seats: (SeatViewerView | undefined)[][] = Array(roomWidth + 1)
        .fill(null)
        .map(() => Array(roomHeight + 1).fill(undefined));

    for (const seat of data.seats) {
        seats[seat.row][seat.number] = {
            id: seat.id,
            reserved: false
        };
    }

    for (const reservedSeat of data.reserved) {
        if (seats[reservedSeat.row]?.[reservedSeat.number]) {
            seats[reservedSeat.row][reservedSeat.number]!.reserved = true;
        }
    }

    // Transform server data for Auditorium component
    const auditoriumSeats = data.seats.map(seat => ({
        id: seat.id,
        row: seat.row,
        seatNumber: seat.number
    }));

    const reservedSeatIds = data.reserved.map(seat => seat.id);

    return {
        roomHeight,
        roomWidth,
        seats,
        roomName: data.auditoriumName,
        startTime: data.startTime,
        movie: data.movie,
        screeningId: data.id,
        // Data for Auditorium component
        auditoriumSeats,
        reservedSeatIds
    };
};