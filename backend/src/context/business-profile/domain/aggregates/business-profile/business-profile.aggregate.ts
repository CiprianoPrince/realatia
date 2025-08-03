import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import { Company, ProfessionalCredentials } from '../../entities';
import {
    BusinessProfileCreated,
    BusinessProfileUpdated,
    CertificationAdded,
    CertificationRemoved,
    ProfileCompletionChanged,
} from '../../events';
import { EProfileCompletionLevel, ETeamSize } from '../../types';
import {
    BusinessAddress,
    BusinessProfileId,
    Certification,
    LicenseNumber,
    ProfileCompletionStatus,
} from '../../value-objects';

export class BusinessProfile extends AggregateRoot<BusinessProfileId> {
    private constructor(
        id: BusinessProfileId,
        private readonly userId: UserId,
        private company: Company,
        private credentials: ProfessionalCredentials,
        private businessAddress?: BusinessAddress,
        private teamSize: ETeamSize = ETeamSize.SOLO,
        private completionStatus: ProfileCompletionStatus = new ProfileCompletionStatus(
            EProfileCompletionLevel.BASIC,
            0
        ),
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(
        userId: UserId,
        company: Company,
        teamSize: ETeamSize = ETeamSize.SOLO,
        businessAddress?: BusinessAddress
    ): BusinessProfile {
        const profileId = BusinessProfileId.generate();
        const credentials = ProfessionalCredentials.create();

        const profile = new BusinessProfile(profileId, userId, company, credentials, businessAddress, teamSize);

        profile.updateCompletionStatus();

        const businessProfileCreatedEvent: BusinessProfileCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'BusinessProfileCreated',
            occurredOn: new Date(),
            userId: userId.getValue(),
            businessProfileId: profileId.getValue(),
            companyName: company.getName(),
        };

        profile.addDomainEvent(businessProfileCreatedEvent);

        return profile;
    }

    // Factory method for reconstruction from persistence
    static fromPersistence(
        id: BusinessProfileId,
        userId: UserId,
        company: Company,
        credentials: ProfessionalCredentials,
        businessAddress: BusinessAddress | undefined,
        teamSize: ETeamSize,
        completionStatus: ProfileCompletionStatus,
        createdAt: Date,
        updatedAt: Date
    ): BusinessProfile {
        return new BusinessProfile(
            id,
            userId,
            company,
            credentials,
            businessAddress,
            teamSize,
            completionStatus,
            createdAt,
            updatedAt
        );
    }

    updateCompany(company: Company): void {
        const oldLevel = this.completionStatus.getLevel();
        this.company = company;
        this.updatedAt = new Date();
        this.updateCompletionStatus();

        const businessProfileUpdatedEvent: BusinessProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'BusinessProfileUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.getId().getValue(),
            updatedFields: ['company'],
        };

        this.addDomainEvent(businessProfileUpdatedEvent);
        this.checkCompletionLevelChange(oldLevel);
    }

    updateBusinessAddress(businessAddress: BusinessAddress): void {
        const oldLevel = this.completionStatus.getLevel();
        this.businessAddress = businessAddress;
        this.updatedAt = new Date();
        this.updateCompletionStatus();

        const businessProfileUpdatedEvent: BusinessProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'BusinessProfileUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.getId().getValue(),
            updatedFields: ['businessAddress'],
        };

        this.addDomainEvent(businessProfileUpdatedEvent);
        this.checkCompletionLevelChange(oldLevel);
    }

    updateTeamSize(teamSize: ETeamSize): void {
        this.teamSize = teamSize;
        this.updatedAt = new Date();

        const businessProfileUpdatedEvent: BusinessProfileUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'BusinessProfileUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.getId().getValue(),
            updatedFields: ['teamSize'],
        };

        this.addDomainEvent(businessProfileUpdatedEvent);
    }

    addCertification(certification: Certification): void {
        const oldLevel = this.completionStatus.getLevel();
        this.credentials.addCertification(certification);
        this.updatedAt = new Date();
        this.updateCompletionStatus();

        const certificationAddedEvent: CertificationAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'CertificationAdded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.getId().getValue(),
            certificationName: certification.getName(),
            issuedBy: certification.getIssuedBy(),
        };

        this.addDomainEvent(certificationAddedEvent);
        this.checkCompletionLevelChange(oldLevel);
    }

    removeCertification(certification: Certification): void {
        const oldLevel = this.completionStatus.getLevel();
        this.credentials.removeCertification(certification);
        this.updatedAt = new Date();
        this.updateCompletionStatus();

        const certificationRemovedEvent: CertificationRemoved = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'CertificationRemoved',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.getId().getValue(),
            certificationName: certification.getName(),
        };

        this.addDomainEvent(certificationRemovedEvent);
        this.checkCompletionLevelChange(oldLevel);
    }

    addLicense(license: LicenseNumber): void {
        const oldLevel = this.completionStatus.getLevel();
        this.credentials.addLicense(license);
        this.updatedAt = new Date();
        this.updateCompletionStatus();
        this.checkCompletionLevelChange(oldLevel);
    }

    removeLicense(license: LicenseNumber): void {
        const oldLevel = this.completionStatus.getLevel();
        this.credentials.removeLicense(license);
        this.updatedAt = new Date();
        this.updateCompletionStatus();
        this.checkCompletionLevelChange(oldLevel);
    }

    private updateCompletionStatus(): void {
        this.completionStatus = ProfileCompletionStatus.calculate(
            !!this.company,
            this.credentials.hasCredentials(),
            !!this.businessAddress,
            !!this.company?.getDescription(),
            this.credentials.getCertifications().length
        );
    }

    private checkCompletionLevelChange(oldLevel: EProfileCompletionLevel): void {
        const newLevel = this.completionStatus.getLevel();

        if (oldLevel !== newLevel) {
            const profileCompletionChangedEvent: ProfileCompletionChanged = {
                eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                eventType: 'ProfileCompletionChanged',
                occurredOn: new Date(),
                userId: this.userId.getValue(),
                businessProfileId: this.getId().getValue(),
                oldCompletionLevel: oldLevel,
                newCompletionLevel: newLevel,
                completionPercentage: this.completionStatus.getCompletionPercentage(),
            };

            this.addDomainEvent(profileCompletionChangedEvent);
        }
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getCompany(): Company {
        return this.company;
    }
    getCredentials(): ProfessionalCredentials {
        return this.credentials;
    }
    getBusinessAddress(): BusinessAddress | undefined {
        return this.businessAddress;
    }
    getTeamSize(): ETeamSize {
        return this.teamSize;
    }
    getCompletionStatus(): ProfileCompletionStatus {
        return this.completionStatus;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    isComplete(): boolean {
        return this.completionStatus.isComplete();
    }
}
