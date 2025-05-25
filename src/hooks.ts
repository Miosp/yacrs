import { Prisma } from "@prisma/client";
import type { Transport } from "@sveltejs/kit";

export const transport: Transport = {
    Decimal: {
        encode: (value: any) => value instanceof Prisma.Decimal && value.toString(),
        decode: (value: string) => new Prisma.Decimal(value)
    }
}
