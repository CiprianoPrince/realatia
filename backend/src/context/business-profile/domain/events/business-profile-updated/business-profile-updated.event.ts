import { IDomainEvent } from '@shared/domain/types';

export interface BusinessProfileUpdated extends IDomainEvent {
    readonly eventType: 'BusinessProfileUpdated';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly updatedFields: string[];
}
