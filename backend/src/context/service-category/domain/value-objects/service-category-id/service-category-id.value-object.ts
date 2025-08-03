import { ValueObject } from '@shared/domain/value-objects';

export class ServiceCategoryId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('ServiceCategoryId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof ServiceCategoryId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): ServiceCategoryId {
        return new ServiceCategoryId(`service_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
