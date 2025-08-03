import { ValueObject } from '@shared/domain/value-objects';

export class CategoryName extends ValueObject {
    private static readonly MAX_LENGTH = 50;

    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('Category name cannot be empty');
        }
        if (value.length > CategoryName.MAX_LENGTH) {
            throw new Error(`Category name cannot exceed ${CategoryName.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof CategoryName && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
