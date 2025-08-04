import { ValueObject } from '@shared/domain/value-objects';

export class ChapterId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('ChapterId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ChapterId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): ChapterId {
        return new ChapterId(`chapter_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
