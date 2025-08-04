import { Injectable } from '@nestjs/common';
import { BusinessProfileId, UserId } from '@shared/domain/value-objects';
import { Portfolio } from '../../aggregates';
import { PortfolioRepository } from '../../ports';

@Injectable()
export class PortfolioDomainService {
    async validatePortfolioCreation(
        userId: UserId,
        businessProfileId: BusinessProfileId,
        portfolioRepository: PortfolioRepository
    ): Promise<void> {
        const existingPortfolio = await portfolioRepository.findByUserId(userId);
        if (existingPortfolio) {
            throw new Error('User already has a portfolio');
        }
    }

    calculatePortfolioScore(portfolio: Portfolio): number {
        let score = 0;

        // Base score from project count
        const projectCount = portfolio.getProjectCount();
        score += Math.min(projectCount * 10, 50); // Max 50 points for projects

        // Bonus for media
        const mediaCount = portfolio.getTotalMediaCount();
        score += Math.min(mediaCount * 2, 30); // Max 30 points for media

        // Bonus for project diversity (different types)
        const projectTypes = new Set(portfolio.getProjects().map((p) => p.getProjectType()));
        score += projectTypes.size * 5; // 5 points per unique type

        // Bonus for recent projects (last 3 years)
        const currentYear = new Date().getFullYear();
        const recentProjects = portfolio
            .getProjects()
            .filter((p) => p.getCompletionYear().getYear() >= currentYear - 3);
        score += Math.min(recentProjects.length * 3, 20); // Max 20 points

        return Math.min(score, 150); // Cap at 150
    }
}
