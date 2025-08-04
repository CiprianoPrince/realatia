import { IDomainEvent } from '@shared/domain/types';

export interface ProjectUpdated extends IDomainEvent {
    readonly eventType: 'ProjectUpdated';
    readonly userId: string;
    readonly portfolioId: string;
    readonly projectId: string;
    readonly updatedFields: string[];
}
