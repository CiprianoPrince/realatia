import { ValueObject } from '@shared/domain/value-objects';

export class CategoryIcon extends ValueObject {
    constructor(private readonly iconName: string) {
        super();
        if (!iconName || iconName.trim().length === 0) {
            throw new Error('Category icon cannot be empty');
        }
    }

    getIconName(): string {
        return this.iconName;
    }

    equals(other: ValueObject): boolean {
        return other instanceof CategoryIcon && this.iconName === other.iconName;
    }

    toString(): string {
        return this.iconName;
    }
}
