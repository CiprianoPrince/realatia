import { ValueObject } from 'src/shared/domain/value-objects';

export class PhoneNumber extends ValueObject {
    private static readonly PHONE_REGEX = /^\+?[\d\s\-()]{10,}$/;

    constructor(private readonly value: string) {
        super();
        if (!PhoneNumber.PHONE_REGEX.test(value)) {
            throw new Error('Invalid phone number format');
        }
    }

    getValue(): string {
        return this.value;
    }

    getFormattedValue(): string {
        const digits = this.value.replace(/\D/g, '');

        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }

        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof PhoneNumber && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
