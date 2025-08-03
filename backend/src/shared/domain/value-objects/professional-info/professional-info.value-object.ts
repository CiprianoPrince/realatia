import { ValueObject } from '@shared/domain/value-objects';

export class ProfessionalInfo extends ValueObject {
    constructor(
        private readonly title: string,
        private readonly yearsOfExperience: number,
        private readonly specializations: string[] = [],
        private readonly linkedInProfile?: string
    ) {
        super();
        if (!title) {
            throw new Error('Professional title is required');
        }
        if (yearsOfExperience < 0) {
            throw new Error('Years of experience cannot be negative');
        }
    }

    getTitle(): string {
        return this.title;
    }
    getYearsOfExperience(): number {
        return this.yearsOfExperience;
    }
    getSpecializations(): string[] {
        return [...this.specializations];
    }
    getLinkedInProfile(): string | undefined {
        return this.linkedInProfile;
    }

    addSpecialization(specialization: string): ProfessionalInfo {
        if (this.specializations.includes(specialization)) {
            return this;
        }

        return new ProfessionalInfo(
            this.title,
            this.yearsOfExperience,
            [...this.specializations, specialization],
            this.linkedInProfile
        );
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof ProfessionalInfo &&
            this.title === other.title &&
            this.yearsOfExperience === other.yearsOfExperience
        );
    }

    toString(): string {
        return `${this.title} (${this.yearsOfExperience} years)`;
    }
}
