import { ValueObject } from '@shared/domain/value-objects';

export class CategoryDescription extends ValueObject {
    private static readonly MAX_LENGTH = 500;

    constructor(private readonly value: string) {
        super();
        if (value && value.length > CategoryDescription.MAX_LENGTH) {
            throw new Error(`Category description cannot exceed ${CategoryDescription.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    isEmpty(): boolean {
        return !this.value || this.value.trim().length === 0;
    }

    equals(other: ValueObject): boolean {
        return other instanceof CategoryDescription && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
