import { ValueObject } from '@shared/domain/value-objects';

export class ChapterName extends ValueObject {
    private static readonly MAX_LENGTH = 100;

    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('Chapter name cannot be empty');
        }
        if (value.length > ChapterName.MAX_LENGTH) {
            throw new Error(`Chapter name cannot exceed ${ChapterName.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ChapterName && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
