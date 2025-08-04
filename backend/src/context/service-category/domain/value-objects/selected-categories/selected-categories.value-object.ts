import { ValueObject } from '@shared/domain/value-objects';
import { EStandardServiceCategory } from '../../types';

export class SelectedCategories extends ValueObject {
    private static readonly MAX_CATEGORIES = 5;

    constructor(private readonly categories: EStandardServiceCategory[]) {
        super();
        if (categories.length > SelectedCategories.MAX_CATEGORIES) {
            throw new Error(`Cannot select more than ${SelectedCategories.MAX_CATEGORIES} categories`);
        }

        // Remove duplicates
        const uniqueCategories = [...new Set(categories)];
        if (uniqueCategories.length !== categories.length) {
            throw new Error('Duplicate categories are not allowed');
        }
    }

    getCategories(): EStandardServiceCategory[] {
        return [...this.categories];
    }

    hasCategory(category: EStandardServiceCategory): boolean {
        return this.categories.includes(category);
    }

    addCategory(category: EStandardServiceCategory): SelectedCategories {
        if (this.hasCategory(category)) {
            return this;
        }

        if (this.categories.length >= SelectedCategories.MAX_CATEGORIES) {
            throw new Error(`Cannot add more than ${SelectedCategories.MAX_CATEGORIES} categories`);
        }

        return new SelectedCategories([...this.categories, category]);
    }

    removeCategory(category: EStandardServiceCategory): SelectedCategories {
        return new SelectedCategories(this.categories.filter((c) => c !== category));
    }

    equals(other: ValueObject): boolean {
        if (!(other instanceof SelectedCategories)) return false;

        if (this.categories.length !== other.categories.length) return false;

        const sortedThis = [...this.categories].sort();
        const sortedOther = [...other.categories].sort();

        return sortedThis.every((cat, index) => cat === sortedOther[index]);
    }

    toString(): string {
        return this.categories.join(', ');
    }
}
