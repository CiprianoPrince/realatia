import { AggregateRoot } from '@shared/domain/aggregates';
import { Email, UserId } from '@shared/domain/value-objects';
import {
    EmailVerificationRequested,
    EmailVerified,
    UserLoggedIn,
    UserProfileUpdated,
    UserRegistered,
} from '../../events';
import { UserStatus, VerificationStatus } from '../../types';
import { ContactInformation, Password, PersonalInfo, ProfessionalInfo, SocialMediaLinks } from '../../value-objects';

export class User extends AggregateRoot<UserId> {
    private constructor(
        id: UserId,
        private email: Email,
        private password: Password,
        private personalInfo: PersonalInfo,
        private professionalInfo: ProfessionalInfo,
        private contactInfo: ContactInformation,
        private socialMediaLinks: SocialMediaLinks,
        private status: UserStatus = UserStatus.PENDING_VERIFICATION,
        private emailVerificationStatus: VerificationStatus = VerificationStatus.PENDING,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(
        email: Email,
        password: Password,
        personalInfo: PersonalInfo,
        professionalInfo: ProfessionalInfo,
        contactInfo: ContactInformation,
        socialMediaLinks: SocialMediaLinks = new SocialMediaLinks()
    ): User {
        const userId = UserId.generate();

        const user = new User(userId, email, password, personalInfo, professionalInfo, contactInfo, socialMediaLinks);

        const userRegisteredEvent: UserRegistered = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserRegistered',
            occurredOn: new Date(),
            userId: userId.getValue(),
            email: email.getValue(),
            fullName: personalInfo.getFullName(),
        };

        user.addDomainEvent(userRegisteredEvent);

        const emailVerificationEvent: EmailVerificationRequested = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'EmailVerificationRequested',
            occurredOn: new Date(),
            userId: userId.getValue(),
            email: email.getValue(),
            verificationCode: user.generateVerificationCode(),
        };

        user.addDomainEvent(emailVerificationEvent);

        return user;
    }

    // Factory method for reconstruction from persistence
    static fromPersistence(
        id: UserId,
        email: Email,
        password: Password,
        personalInfo: PersonalInfo,
        professionalInfo: ProfessionalInfo,
        contactInfo: ContactInformation,
        socialMediaLinks: SocialMediaLinks,
        status: UserStatus,
        emailVerificationStatus: VerificationStatus,
        createdAt: Date,
        updatedAt: Date
    ): User {
        return new User(
            id,
            email,
            password,
            personalInfo,
            professionalInfo,
            contactInfo,
            socialMediaLinks,
            status,
            emailVerificationStatus,
            createdAt,
            updatedAt
        );
    }

    private generateVerificationCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    verifyEmail(verificationCode: string): void {
        if (this.emailVerificationStatus === VerificationStatus.VERIFIED) {
            throw new Error('Email is already verified');
        }

        // In real implementation, verify against stored code
        this.emailVerificationStatus = VerificationStatus.VERIFIED;
        this.status = UserStatus.ACTIVE;
        this.updatedAt = new Date();

        const emailVerifiedEvent: EmailVerified = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'EmailVerified',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            email: this.email.getValue(),
        };

        this.addDomainEvent(emailVerifiedEvent);
    }

    async login(plainPassword: string, ipAddress: string): Promise<void> {
        if (!(await this.password.verify(plainPassword))) {
            throw new Error('Invalid password');
        }

        if (this.status !== UserStatus.ACTIVE) {
            throw new Error('User account is not active');
        }

        const loginEvent: UserLoggedIn = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserLoggedIn',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            loginTimestamp: new Date(),
            ipAddress,
        };

        this.addDomainEvent(loginEvent);
    }

    updatePersonalInfo(personalInfo: PersonalInfo): void {
        this.personalInfo = personalInfo;
        this.updatedAt = new Date();

        const profileUpdatedEvent: UserProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserProfileUpdated',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            updatedFields: ['personalInfo'],
        };

        this.addDomainEvent(profileUpdatedEvent);
    }

    updateProfessionalInfo(professionalInfo: ProfessionalInfo): void {
        this.professionalInfo = professionalInfo;
        this.updatedAt = new Date();

        const profileUpdatedEvent: UserProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserProfileUpdated',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            updatedFields: ['professionalInfo'],
        };

        this.addDomainEvent(profileUpdatedEvent);
    }

    updateContactInfo(contactInfo: ContactInformation): void {
        this.contactInfo = contactInfo;
        this.updatedAt = new Date();

        const profileUpdatedEvent: UserProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserProfileUpdated',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            updatedFields: ['contactInfo'],
        };

        this.addDomainEvent(profileUpdatedEvent);
    }

    updateSocialMediaLinks(socialMediaLinks: SocialMediaLinks): void {
        this.socialMediaLinks = socialMediaLinks;
        this.updatedAt = new Date();

        const profileUpdatedEvent: UserProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserProfileUpdated',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            updatedFields: ['socialMediaLinks'],
        };

        this.addDomainEvent(profileUpdatedEvent);
    }

    async changePassword(currentPassword: string, newPassword: Password): Promise<void> {
        if (!(await this.password.verify(currentPassword))) {
            throw new Error('Current password is incorrect');
        }

        this.password = newPassword;
        this.updatedAt = new Date();

        const profileUpdatedEvent: UserProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'UserProfileUpdated',
            occurredOn: new Date(),
            userId: this.getId().getValue(),
            updatedFields: ['password'],
        };

        this.addDomainEvent(profileUpdatedEvent);
    }

    suspend(): void {
        this.status = UserStatus.SUSPENDED;
        this.updatedAt = new Date();
    }

    activate(): void {
        if (this.emailVerificationStatus !== VerificationStatus.VERIFIED) {
            throw new Error('Cannot activate user with unverified email');
        }
        this.status = UserStatus.ACTIVE;
        this.updatedAt = new Date();
    }

    // Getters
    getEmail(): Email {
        return this.email;
    }
    getPersonalInfo(): PersonalInfo {
        return this.personalInfo;
    }
    getProfessionalInfo(): ProfessionalInfo {
        return this.professionalInfo;
    }
    getContactInfo(): ContactInformation {
        return this.contactInfo;
    }
    getSocialMediaLinks(): SocialMediaLinks {
        return this.socialMediaLinks;
    }
    getStatus(): UserStatus {
        return this.status;
    }
    getEmailVerificationStatus(): VerificationStatus {
        return this.emailVerificationStatus;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    isActive(): boolean {
        return this.status === UserStatus.ACTIVE;
    }

    isEmailVerified(): boolean {
        return this.emailVerificationStatus === VerificationStatus.VERIFIED;
    }
}
