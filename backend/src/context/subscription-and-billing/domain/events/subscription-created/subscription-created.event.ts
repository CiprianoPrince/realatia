import { IDomainEvent } from '@shared/domain/types';
import { EBillingCycle, ESubscriptionPlan } from 'src/context/subscription-and-billing/domain/types';

export interface SubscriptionCreated extends IDomainEvent {
    readonly eventType: 'SubscriptionCreated';
    readonly userId: string;
    readonly subscriptionId: string;
    readonly plan: ESubscriptionPlan;
    readonly billingCycle: EBillingCycle;
}
