export function encodeReserveList(seats: number[]): string {
    return btoa(JSON.stringify(seats));
}

export function decodeReserveList(encoded: string): number[] {
    const json = atob(encoded);
    return JSON.parse(json);
}
