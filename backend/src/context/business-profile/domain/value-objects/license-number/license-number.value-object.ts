import { ValueObject } from '@shared/domain/value-objects';

export class LicenseNumber extends ValueObject {
    constructor(
        private readonly number: string,
        private readonly state: string,
        private readonly licenseType: string,
        private readonly expiryDate?: Date
    ) {
        super();
        if (!number || !state || !licenseType) {
            throw new Error('License number, state, and type are required');
        }
    }

    getNumber(): string {
        return this.number;
    }
    getState(): string {
        return this.state;
    }
    getLicenseType(): string {
        return this.licenseType;
    }
    getExpiryDate(): Date | undefined {
        return this.expiryDate;
    }

    isExpired(): boolean {
        if (!this.expiryDate) return false;
        return this.expiryDate < new Date();
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof LicenseNumber &&
            this.number === other.number &&
            this.state === other.state &&
            this.licenseType === other.licenseType
        );
    }

    toString(): string {
        return `${this.licenseType} #${this.number} (${this.state})`;
    }
}
