import { IDomainEvent } from '@shared/domain/types';

export interface PortfolioCreated extends IDomainEvent {
    readonly eventType: 'PortfolioCreated';
    readonly userId: string;
    readonly portfolioId: string;
}
