import { ValueObject } from '@shared/domain/value-objects';

export class Amount extends ValueObject {
    constructor(
        private readonly value: number,
        private readonly currency: string = 'USD'
    ) {
        super();
        if (value < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (!currency || currency.length !== 3) {
            throw new Error('Currency must be a 3-letter code');
        }
    }

    getValue(): number {
        return this.value;
    }
    getCurrency(): string {
        return this.currency;
    }

    add(other: Amount): Amount {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add amounts with different currencies');
        }
        return new Amount(this.value + other.value, this.currency);
    }

    multiply(multiplier: number): Amount {
        if (multiplier < 0) {
            throw new Error('Multiplier cannot be negative');
        }
        return new Amount(this.value * multiplier, this.currency);
    }

    equals(other: ValueObject): boolean {
        return other instanceof Amount && this.value === other.value && this.currency === other.currency;
    }

    toString(): string {
        return `${this.currency} ${this.value.toFixed(2)}`;
    }
}
