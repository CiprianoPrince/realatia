import { ValueObject } from '@shared/domain/value-objects';

export class PortfolioId extends ValueObject {
    constructor(private readonly value: string) {
        super();
        if (!value || value.trim().length === 0) {
            throw new Error('PortfolioId cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ValueObject): boolean {
        return other instanceof PortfolioId && this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): PortfolioId {
        return new PortfolioId(`portfolio_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    }
}
