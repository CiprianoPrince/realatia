import { ValueObject } from '@shared/domain/value-objects';

export class Certification extends ValueObject {
    constructor(
        private readonly name: string,
        private readonly issuedBy: string,
        private readonly issuedDate: Date,
        private readonly validUntil?: Date,
        private readonly credentialId?: string
    ) {
        super();
        if (!name || !issuedBy) {
            throw new Error('Certification name and issuer are required');
        }
    }

    getName(): string {
        return this.name;
    }
    getIssuedBy(): string {
        return this.issuedBy;
    }
    getIssuedDate(): Date {
        return this.issuedDate;
    }
    getValidUntil(): Date | undefined {
        return this.validUntil;
    }
    getCredentialId(): string | undefined {
        return this.credentialId;
    }

    isValid(): boolean {
        if (!this.validUntil) return true;
        return this.validUntil > new Date();
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof Certification &&
            this.name === other.name &&
            this.issuedBy === other.issuedBy &&
            this.credentialId === other.credentialId
        );
    }

    toString(): string {
        return `${this.name} by ${this.issuedBy}`;
    }
}
