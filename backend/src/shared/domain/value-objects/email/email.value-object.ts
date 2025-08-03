import { ValueObject } from '@shared/domain/value-objects';

export class Email extends ValueObject {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(private readonly value: string) {
        super();
        if (!Email.EMAIL_REGEX.test(value)) {
            throw new Error('Invalid email format'); // TODO create exception
        }
    }

    getValue(): string {
        return this.value;
    }

    getDomain(): string {
        return this.value.split('@')[1];
    }

    equals(other: ValueObject): boolean {
        return other instanceof Email && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
