import { IDomainEvent } from '@shared/domain/types';

export interface SubscriptionRenewed extends IDomainEvent {
    readonly eventType: 'SubscriptionRenewed';
    readonly userId: string;
    readonly subscriptionId: string;
    readonly newExpiryDate: Date;
}
