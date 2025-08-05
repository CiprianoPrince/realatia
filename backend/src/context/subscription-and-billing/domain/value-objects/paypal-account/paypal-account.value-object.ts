import { Email, ValueObject } from '@shared/domain/value-objects';

export class PayPalAccount extends ValueObject {
    constructor(
        private readonly email: Email,
        private readonly accountId: string
    ) {
        super();
        if (!accountId) {
            throw new Error('PayPal account ID is required');
        }
    }

    getEmail(): Email {
        return this.email;
    }
    getAccountId(): string {
        return this.accountId;
    }

    equals(other: ValueObject): boolean {
        return other instanceof PayPalAccount && this.email.equals(other.email) && this.accountId === other.accountId;
    }

    toString(): string {
        return `PayPal: ${this.email.getValue()}`;
    }
}
