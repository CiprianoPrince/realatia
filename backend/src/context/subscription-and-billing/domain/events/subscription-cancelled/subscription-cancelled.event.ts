import { IDomainEvent } from '@shared/domain/types';

export interface SubscriptionCancelled extends IDomainEvent {
    readonly eventType: 'SubscriptionCancelled';
    readonly userId: string;
    readonly subscriptionId: string;
}
