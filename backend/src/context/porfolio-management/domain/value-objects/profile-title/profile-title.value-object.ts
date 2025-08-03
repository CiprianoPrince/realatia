import { ValueObject } from '@shared/domain/value-objects';

export class ProjectTitle extends ValueObject {
    private static readonly MAX_LENGTH = 100;

    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('Project title cannot be empty');
        }
        if (value.length > ProjectTitle.MAX_LENGTH) {
            throw new Error(`Project title cannot exceed ${ProjectTitle.MAX_LENGTH} characters`);
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ProjectTitle && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
