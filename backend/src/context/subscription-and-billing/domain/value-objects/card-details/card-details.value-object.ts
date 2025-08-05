import { ValueObject } from '@shared/domain/value-objects';

export class CardDetails extends ValueObject {
    constructor(
        private readonly last4Digits: string,
        private readonly brand: string,
        private readonly expiryMonth: number,
        private readonly expiryYear: number,
        private readonly holderName: string
    ) {
        super();
        if (!/^\d{4}$/.test(last4Digits)) {
            throw new Error('Last 4 digits must be exactly 4 digits');
        }
        if (expiryMonth < 1 || expiryMonth > 12) {
            throw new Error('Expiry month must be between 1 and 12');
        }
        if (expiryYear < new Date().getFullYear()) {
            throw new Error('Card has expired');
        }
    }

    getLast4Digits(): string {
        return this.last4Digits;
    }
    getBrand(): string {
        return this.brand;
    }
    getExpiryMonth(): number {
        return this.expiryMonth;
    }
    getExpiryYear(): number {
        return this.expiryYear;
    }
    getHolderName(): string {
        return this.holderName;
    }

    isExpired(): boolean {
        const now = new Date();
        const expiry = new Date(this.expiryYear, this.expiryMonth - 1);
        return expiry < now;
    }

    getMaskedNumber(): string {
        return `****-****-****-${this.last4Digits}`;
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof CardDetails &&
            this.last4Digits === other.last4Digits &&
            this.brand === other.brand &&
            this.expiryMonth === other.expiryMonth &&
            this.expiryYear === other.expiryYear
        );
    }

    toString(): string {
        return `${this.brand} ending in ${this.last4Digits}`;
    }
}
