import { ValueObject } from '@shared/domain/value-objects';

export class CompletionYear extends ValueObject {
    constructor(private readonly year: number) {
        super();
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 5) {
            throw new Error('Completion year must be between 1900 and 5 years in the future');
        }
    }

    getYear(): number {
        return this.year;
    }

    isInFuture(): boolean {
        return this.year > new Date().getFullYear();
    }

    equals(other: ValueObject): boolean {
        return other instanceof CompletionYear && this.year === other.year;
    }

    toString(): string {
        return this.year.toString();
    }
}
