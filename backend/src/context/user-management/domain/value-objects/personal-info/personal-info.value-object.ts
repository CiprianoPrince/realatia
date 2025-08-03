import { ValueObject } from '@shared/domain/value-objects';

export class PersonalInfo extends ValueObject {
    constructor(
        private readonly firstName: string,
        private readonly lastName: string,
        private readonly dateOfBirth?: Date,
        private readonly profilePicture?: string
    ) {
        super();
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required');
        }
    }

    getFirstName(): string {
        return this.firstName;
    }
    getLastName(): string {
        return this.lastName;
    }
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    getDateOfBirth(): Date | undefined {
        return this.dateOfBirth;
    }
    getProfilePicture(): string | undefined {
        return this.profilePicture;
    }

    withProfilePicture(profilePicture: string): PersonalInfo {
        return new PersonalInfo(this.firstName, this.lastName, this.dateOfBirth, profilePicture);
    }

    equals(other: ValueObject): boolean {
        return (
            other instanceof PersonalInfo &&
            this.firstName === other.firstName &&
            this.lastName === other.lastName &&
            this.dateOfBirth?.getTime() === other.dateOfBirth?.getTime()
        );
    }

    toString(): string {
        return this.getFullName();
    }
}
