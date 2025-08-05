import { ValueObject } from '@shared/domain/value-objects';

export class Subject extends ValueObject {
    private static readonly MAX_LENGTH = 200;

    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('Subject cannot be empty');
        }
        if (value.length > Subject.MAX_LENGTH) {
            throw new Error(`Subject cannot exceed ${Subject.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof Subject && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
