import { IDomainEvent } from '@shared/domain/types';

export interface PaymentFailed extends IDomainEvent {
    readonly eventType: 'PaymentFailed';
    readonly userId: string;
    readonly subscriptionId: string;
    readonly billingHistoryId: string;
    readonly amount: number;
    readonly currency: string;
    readonly failureReason: string;
}
