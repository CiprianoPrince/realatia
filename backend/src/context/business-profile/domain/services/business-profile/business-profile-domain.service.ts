import { Injectable } from '@nestjs/common';
import { UserId } from '@shared/domain/value-objects';
import { BusinessProfile } from '../../aggregates';
import { BusinessProfileRepository } from '../../ports';

@Injectable()
export class BusinessProfileDomainService {
    async validateProfileCreation(userId: UserId, businessProfileRepository: BusinessProfileRepository): Promise<void> {
        const existingProfile = await businessProfileRepository.findByUserId(userId);
        if (existingProfile) {
            throw new Error('User already has a business profile');
        }
    }

    calculateProfileScore(profile: BusinessProfile): number {
        let score = 0;

        // Base score from completion
        score += profile.getCompletionStatus().getCompletionPercentage();

        // Bonus for certifications
        const certCount = profile.getCredentials().getCertifications().length;
        score += Math.min(certCount * 5, 25); // Max 25 bonus points

        // Bonus for valid licenses
        const licenseCount = profile.getCredentials().getValidLicenses().length;
        score += Math.min(licenseCount * 10, 30); // Max 30 bonus points

        // Bonus for business address
        if (profile.getBusinessAddress()) {
            score += 10;
        }

        return Math.min(score, 200); // Cap at 200
    }
}
