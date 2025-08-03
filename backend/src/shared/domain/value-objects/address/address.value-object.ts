import { ValueObject } from '@shared/domain/value-objects';

export class Address extends ValueObject {
    constructor(
        private readonly street: string,
        private readonly city: string,
        private readonly state: string,
        private readonly zipCode: string,
        private readonly country: string = 'US'
    ) {
        super();
        if (!street || !city || !state || !zipCode) {
            throw new Error('All address fields are required');
        }
    }

    getStreet(): string {
        return this.street;
    }
    getCity(): string {
        return this.city;
    }
    getState(): string {
        return this.state;
    }
    getZipCode(): string {
        return this.zipCode;
    }
    getCountry(): string {
        return this.country;
    }

    getFullAddress(): string {
        return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof Address &&
            this.street === other.street &&
            this.city === other.city &&
            this.state === other.state &&
            this.zipCode === other.zipCode &&
            this.country === other.country
        );
    }

    toString(): string {
        return this.getFullAddress();
    }
}
