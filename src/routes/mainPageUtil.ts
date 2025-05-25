import { format } from "date-fns";

export function dateStrOrToday(dateInput: string): string | undefined {
    if (dateInput === '' || dateInput === format(new Date(), 'yyyy-MM-dd')) {
        return undefined;
    } else {
        return dateInput;
    }
}