import { PaymentStatus } from "@prisma/client";

export function formatPaymentStatus(status: PaymentStatus): string {
    switch (status) {
        case PaymentStatus.COMPLETED:
            return "Completed";
        case PaymentStatus.RESERVED:
            return "Reserved";
        case PaymentStatus.REFUNDED:
            return "Refunded";
        case PaymentStatus.PENDING:
            return "Pending";
        case PaymentStatus.FAILED:
            return "Failed";
    }
}