export type Seat = {
    exists: true;
    id: number;
    row: number;
    number: number;
    state: SeatState;
}

export type EmptySeat = {
    exists: false;
    row: number;
    number: number;
}

export const SeatState = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    USER_RESERVED: 'user-reserved'
} as const;
export type SeatState = (typeof SeatState)[keyof typeof SeatState];