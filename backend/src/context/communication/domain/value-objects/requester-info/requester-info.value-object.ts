import { ValueObject } from '@shared/domain/value-objects';

export class RequesterInfo extends ValueObject {
    constructor(
        private readonly name: string,
        private readonly email: string,
        private readonly phone?: string,
        private readonly company?: string
    ) {
        super();
        if (!name || !email) {
            throw new Error('Name and email are required');
        }
    }

    getName(): string {
        return this.name;
    }
    getEmail(): string {
        return this.email;
    }
    getPhone(): string | undefined {
        return this.phone;
    }
    getCompany(): string | undefined {
        return this.company;
    }

    equals(other: ValueObject): boolean {
        return other instanceof RequesterInfo && this.name === other.name && this.email === other.email;
    }

    toString(): string {
        return `${this.name} (${this.email})`;
    }
}
