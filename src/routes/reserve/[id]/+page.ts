import type { PageLoad } from "./$types";

export type SeatViewerView = {
    id: number;
    reserved: boolean;
}

export const load: PageLoad = async ({ parent, data, params }) => {
    await parent();
    const screeningId = parseInt(params.id);

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

    return { roomHeight, roomWidth, seats, roomName: data.audtoriumName, startTime: data.startTime, movie: data.movie, screeningId };
};