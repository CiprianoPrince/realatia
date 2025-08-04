import { ValueObject } from '@shared/domain/value-objects';

export class MembershipId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('MembershipId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof MembershipId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): MembershipId {
        return new MembershipId(`membership_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
