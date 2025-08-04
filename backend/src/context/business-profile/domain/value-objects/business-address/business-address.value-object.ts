import { Address, ValueObject } from '@shared/domain/value-objects';

export class BusinessAddress extends ValueObject {
    constructor(
        private readonly address: Address,
        private readonly isHeadquarters: boolean = true,
        private readonly locationName?: string
    ) {
        super();
    }

    getAddress(): Address {
        return this.address;
    }

    isHeadquarters(): boolean {
        return this.isHeadquarters;
    }

    getLocationName(): string | undefined {
        return this.locationName;
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof BusinessAddress &&
            this.address.equals(other.address) &&
            this.isHeadquarters === other.isHeadquarters
        );
    }

    toString(): string {
        const prefix = this.locationName ? `${this.locationName}: ` : '';
        const suffix = this.isHeadquarters ? ' (HQ)' : '';
        return `${prefix}${this.address.toString()}${suffix}`;
    }
}
