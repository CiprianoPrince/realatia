import { BusinessProfileId, UserId } from '@shared/domain/value-objects';
import { Portfolio } from '../../../aggregates';
import { PortfolioId } from '../../../value-objects';

export interface PortfolioRepository {
    save(portfolio: Portfolio): Promise<void>;
    findById(id: PortfolioId): Promise<Portfolio | null>;
    findByUserId(userId: UserId): Promise<Portfolio | null>;
    findByBusinessProfileId(businessProfileId: BusinessProfileId): Promise<Portfolio | null>;
    delete(id: PortfolioId): Promise<void>;
    findAll(): Promise<Portfolio[]>;
}
