import { ValueObject } from '@shared/domain/value-objects';

export class Money extends ValueObject {
    constructor(
        private readonly amount: number,
        private readonly currency: string = 'USD'
    ) {
        super();
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (!currency || currency.length !== 3) {
            throw new Error('Currency must be a 3-letter code');
        }
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot subtract different currencies');
        }
        if (this.amount < other.amount) {
            throw new Error('Insufficient funds');
        }
        return new Money(this.amount - other.amount, this.currency);
    }

    equals(other: ValueObject): boolean {
        return other instanceof Money && this.amount === other.amount && this.currency === other.currency;
    }

    toString(): string {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }
}
