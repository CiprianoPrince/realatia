import { IDomainEvent } from '@shared/domain/types';

export interface ServiceCategoryCreated extends IDomainEvent {
    readonly eventType: 'ServiceCategoryCreated';
    readonly categoryId: string;
    readonly categoryName: string;
}
