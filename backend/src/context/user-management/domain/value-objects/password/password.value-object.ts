import { ValueObject } from '@shared/domain/value-objects';

export class Password extends ValueObject {
    private static readonly MIN_LENGTH = 8;
    private static readonly STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

    constructor(
        private readonly hashedValue: string,
        private readonly salt: string
    ) {
        super();
    }

    static async create(plainPassword: string): Promise<Password> {
        if (plainPassword.length < Password.MIN_LENGTH) {
            throw new Error(`Password must be at least ${Password.MIN_LENGTH} characters`);
        }

        if (!Password.STRONG_REGEX.test(plainPassword)) {
            throw new Error('Password must contain uppercase, lowercase, number, and special character');
        }

        // In real implementation, use bcrypt
        const bcrypt = import('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const hashedValue = await bcrypt.hash(plainPassword, salt);

        return new Password(hashedValue, salt);
    }

    async verify(plainPassword: string): Promise<boolean> {
        const bcrypt = import('bcrypt');
        return bcrypt.compare(plainPassword, this.hashedValue);
    }

    equals(other: ValueObject): boolean {
        return other instanceof Password && this.hashedValue === other.hashedValue;
    }

    toString(): string {
        return '[PROTECTED]';
    }

    getHashedValue(): string {
        return this.hashedValue;
    }
}
