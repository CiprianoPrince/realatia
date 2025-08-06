import { IDomainEvent } from '@shared/domain/types';

export interface PaymentProcessed extends IDomainEvent {
    readonly eventType: 'PaymentProcessed';
    readonly userId: string;
    readonly subscriptionId: string;
    readonly billingHistoryId: string;
    readonly amount: number;
    readonly currency: string;
}
