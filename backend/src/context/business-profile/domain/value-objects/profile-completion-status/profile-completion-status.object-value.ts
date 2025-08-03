import { ValueObject } from '@shared/domain/value-objects';
import { EProfileCompletionLevel } from '../../types';

export class ProfileCompletionStatus extends ValueObject {
    constructor(
        private readonly level: EProfileCompletionLevel,
        private readonly completionPercentage: number,
        private readonly missingFields: string[] = []
    ) {
        super();
        if (completionPercentage < 0 || completionPercentage > 100) {
            throw new Error('Completion percentage must be between 0 and 100');
        }
    }

    getLevel(): EProfileCompletionLevel {
        return this.level;
    }
    getCompletionPercentage(): number {
        return this.completionPercentage;
    }
    getMissingFields(): string[] {
        return [...this.missingFields];
    }

    isComplete(): boolean {
        return this.completionPercentage === 100;
    }

    static calculate(
        hasCompany: boolean,
        hasCredentials: boolean,
        hasBusinessAddress: boolean,
        hasDescription: boolean,
        certificationCount: number
    ): ProfileCompletionStatus {
        let percentage = 0;
        const missingFields: string[] = [];

        if (hasCompany) percentage += 25;
        else missingFields.push('company');

        if (hasCredentials) percentage += 20;
        else missingFields.push('credentials');

        if (hasBusinessAddress) percentage += 15;
        else missingFields.push('businessAddress');

        if (hasDescription) percentage += 20;
        else missingFields.push('description');

        if (certificationCount > 0) percentage += 20;
        else missingFields.push('certifications');

        let level: EProfileCompletionLevel;
        if (percentage >= 90) level = EProfileCompletionLevel.COMPREHENSIVE;
        else if (percentage >= 70) level = EProfileCompletionLevel.COMPLETE;
        else if (percentage >= 50) level = EProfileCompletionLevel.INTERMEDIATE;
        else level = EProfileCompletionLevel.BASIC;

        return new ProfileCompletionStatus(level, percentage, missingFields);
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof ProfileCompletionStatus &&
            this.level === other.level &&
            this.completionPercentage === other.completionPercentage
        );
    }

    toString(): string {
        return `${this.level} (${this.completionPercentage}%)`;
    }
}
