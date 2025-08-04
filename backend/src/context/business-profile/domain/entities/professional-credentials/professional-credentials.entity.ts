import { Entity } from '@shared/domain/entities';
import { Certification, LicenseNumber } from '../../value-objects';

export class ProfessionalCredentials extends Entity<string> {
    private licenses: LicenseNumber[] = [];
    private certifications: Certification[] = [];

    constructor(
        id: string,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(): ProfessionalCredentials {
        const id = `creds_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new ProfessionalCredentials(id);
    }

    addLicense(license: LicenseNumber): void {
        const exists = this.licenses.some((l) => l.equals(license));
        if (exists) {
            throw new Error('License already exists');
        }

        this.licenses.push(license);
        this.updatedAt = new Date();
    }

    removeLicense(license: LicenseNumber): void {
        this.licenses = this.licenses.filter((l) => !l.equals(license));
        this.updatedAt = new Date();
    }

    addCertification(certification: Certification): void {
        const exists = this.certifications.some((c) => c.equals(certification));
        if (exists) {
            throw new Error('Certification already exists');
        }

        this.certifications.push(certification);
        this.updatedAt = new Date();
    }

    removeCertification(certification: Certification): void {
        this.certifications = this.certifications.filter((c) => !c.equals(certification));
        this.updatedAt = new Date();
    }

    getLicenses(): LicenseNumber[] {
        return [...this.licenses];
    }
    getCertifications(): Certification[] {
        return [...this.certifications];
    }
    getValidLicenses(): LicenseNumber[] {
        return this.licenses.filter((l) => !l.isExpired());
    }
    getValidCertifications(): Certification[] {
        return this.certifications.filter((c) => c.isValid());
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    hasCredentials(): boolean {
        return this.licenses.length > 0 || this.certifications.length > 0;
    }
}
