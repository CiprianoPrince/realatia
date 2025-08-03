import { ValueObject } from '@shared/domain/value-objects';

export class BusinessProfileId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('BusinessProfileId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof BusinessProfileId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): BusinessProfileId {
        return new BusinessProfileId(`bp_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
