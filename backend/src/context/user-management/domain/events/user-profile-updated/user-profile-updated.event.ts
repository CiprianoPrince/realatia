import { IDomainEvent } from '@shared/domain/types';

export interface UserProfileUpdated extends IDomainEvent {
    readonly eventType: 'UserProfileUpdated';
    readonly userId: string;
    readonly updatedFields: string[];
}
