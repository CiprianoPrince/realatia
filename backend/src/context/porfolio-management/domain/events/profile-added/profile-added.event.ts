import { IDomainEvent } from '@shared/domain/types';
import { EProjectType } from '../../types';

export interface ProjectAdded extends IDomainEvent {
    readonly eventType: 'ProjectAdded';
    readonly userId: string;
    readonly portfolioId: string;
    readonly projectId: string;
    readonly projectTitle: string;
    readonly projectType: EProjectType;
}
