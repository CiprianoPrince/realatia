import { IDomainEvent } from '@shared/domain/types';

export interface ProjectRemoved extends IDomainEvent {
    readonly eventType: 'ProjectRemoved';
    readonly userId: string;
    readonly portfolioId: string;
    readonly projectId: string;
}
