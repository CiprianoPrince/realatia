import { IDomainEvent } from '@shared/domain/types';

export interface CustomCategoryAdded extends IDomainEvent {
    readonly eventType: 'CustomCategoryAdded';
    readonly categoryId: string;
    readonly categoryName: string;
}
