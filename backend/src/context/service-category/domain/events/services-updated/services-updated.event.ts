import { IDomainEvent } from '@shared/domain/types';
import { EStandardServiceCategory } from '../../types';

export interface ServicesUpdated extends IDomainEvent {
    readonly eventType: 'ServicesUpdated';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly selectedCategories: EStandardServiceCategory[];
    readonly customServices: string[];
}
