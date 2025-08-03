import { Injectable } from '@nestjs/common';
import { ProfessionalInfo } from '@shared/domain/value-objects';
import { ServiceCategoryRepository } from '../../aggregates';
import { EStandardServiceCategory } from '../../types';
import { CategoryName } from '../../value-objects';

@Injectable()
export class ServiceCategoryDomainService {
    async validateCategoryCreation(
        name: CategoryName,
        serviceCategoryRepository: ServiceCategoryRepository
    ): Promise<void> {
        const existingCategory = await serviceCategoryRepository.findByName(name);
        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }
    }

    getRecommendedCategories(
        professionalInfo: ProfessionalInfo,
        serviceCategoryRepository: ServiceCategoryRepository
    ): EStandardServiceCategory[] {
        const recommendations: EStandardServiceCategory[] = [];
        const title = professionalInfo.getTitle().toLowerCase();
        const specializations = professionalInfo.getSpecializations();

        // Simple recommendation logic based on title and specializations
        if (title.includes('real estate') || title.includes('realtor')) {
            recommendations.push(EStandardServiceCategory.REALTOR);
        }

        if (title.includes('contractor') || title.includes('construction')) {
            recommendations.push(EStandardServiceCategory.CONTRACTOR);
        }

        if (title.includes('designer') || title.includes('interior')) {
            recommendations.push(EStandardServiceCategory.DESIGNER);
        }

        if (title.includes('engineer')) {
            recommendations.push(EStandardServiceCategory.ENGINEER);
        }

        if (title.includes('lender') || title.includes('mortgage')) {
            recommendations.push(EStandardServiceCategory.LENDER);
        }

        // Check specializations for additional recommendations
        for (const specialization of specializations) {
            const spec = specialization.toLowerCase();

            if (spec.includes('inspection')) {
                recommendations.push(EStandardServiceCategory.INSPECTOR);
            }

            if (spec.includes('landscape')) {
                recommendations.push(EStandardServiceCategory.LANDSCAPER);
            }

            if (spec.includes('plumbing')) {
                recommendations.push(EStandardServiceCategory.PLUMBER);
            }

            if (spec.includes('electrical')) {
                recommendations.push(EStandardServiceCategory.ELECTRICIAN);
            }
        }

        // Remove duplicates and limit to 3 recommendations
        return [...new Set(recommendations)].slice(0, 3);
    }
}
