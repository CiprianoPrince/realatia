import { Address, ValueObject } from '@shared/domain/value-objects';

export class BillingAddress extends ValueObject {
    constructor(
        private readonly address: Address,
        private readonly taxId?: string
    ) {
        super();
    }

    getAddress(): Address {
        return this.address;
    }
    getTaxId(): string | undefined {
        return this.taxId;
    }

    equals(other: ValueObject): boolean {
        return other instanceof BillingAddress && this.address.equals(other.address) && this.taxId === other.taxId;
    }

    toString(): string {
        return this.address.toString();
    }
}
