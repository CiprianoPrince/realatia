import { IDomainEvent } from '@shared/domain/types';
import { ESubscriptionPlan } from 'src/context/subscription-and-billing/domain/types';

export interface SubscriptionDowngraded extends IDomainEvent {
    readonly eventType: 'SubscriptionDowngraded';
    readonly userId: string;
    readonly subscriptionId: string;
    readonly oldPlan: ESubscriptionPlan;
    readonly newPlan: ESubscriptionPlan;
}
