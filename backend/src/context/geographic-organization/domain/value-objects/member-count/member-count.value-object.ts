import { ValueObject } from '@shared/domain/value-objects';

export class MemberCount extends ValueObject {
    constructor(private readonly count: number) {
        super();
        if (count < 0) {
            throw new Error('Member count cannot be negative');
        }
    }

    getCount(): number {
        return this.count;
    }

    increment(): MemberCount {
        return new MemberCount(this.count + 1);
    }

    decrement(): MemberCount {
        if (this.count === 0) {
            throw new Error('Cannot decrement member count below zero');
        }
        return new MemberCount(this.count - 1);
    }

    equals(other: ValueObject): boolean {
        return other instanceof MemberCount && this.count === other.count;
    }

    toString(): string {
        return this.count.toString();
    }
}
