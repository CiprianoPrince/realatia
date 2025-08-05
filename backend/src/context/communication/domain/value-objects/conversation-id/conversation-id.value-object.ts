import { ValueObject } from '@shared/domain/value-objects';

export class ConversationId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('ConversationId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ConversationId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): ConversationId {
        return new ConversationId(`conv_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
