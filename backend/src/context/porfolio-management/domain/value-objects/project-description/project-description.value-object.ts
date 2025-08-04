import { ValueObject } from '@shared/domain/value-objects';

export class ProjectDescription extends ValueObject {
    private static readonly MAX_LENGTH = 2000;

    constructor(private readonly value: string) {
        super();
        if (value && value.length > ProjectDescription.MAX_LENGTH) {
            throw new Error(`Project description cannot exceed ${ProjectDescription.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    isEmpty(): boolean {
        return !this.value || this.value.trim().length === 0;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ProjectDescription && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
