type Seat = {
    id: number;
    row: number;
    number: number;
    state: SeatState;
}

const SeatState = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    USER_RESERVED: 'user_reserved',
    EMPTY: 'empty',
} as const;
type SeatState = (typeof SeatState)[keyof typeof SeatState];