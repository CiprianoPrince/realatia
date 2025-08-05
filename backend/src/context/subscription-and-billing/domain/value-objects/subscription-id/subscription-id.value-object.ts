import { ValueObject } from '@shared/domain/value-objects';

export class SubscriptionId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('SubscriptionId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof SubscriptionId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): SubscriptionId {
        return new SubscriptionId(`sub_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
