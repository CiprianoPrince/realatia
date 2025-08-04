import { IDomainEvent } from '@shared/domain/types';

export interface ServiceCategoryUpdated extends IDomainEvent {
    readonly eventType: 'ServiceCategoryUpdated';
    readonly categoryId: string;
    readonly updatedFields: string[];
}
