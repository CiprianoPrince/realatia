import { ValueObject } from '@shared/domain/value-objects';

export class InquiryId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('InquiryId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof InquiryId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): InquiryId {
        return new InquiryId(`inquiry_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
