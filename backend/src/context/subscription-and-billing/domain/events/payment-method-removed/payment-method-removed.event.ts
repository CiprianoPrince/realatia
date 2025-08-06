import { IDomainEvent } from '@shared/domain/types';

export interface PaymentMethodRemoved extends IDomainEvent {
    readonly eventType: 'PaymentMethodRemoved';
    readonly userId: string;
    readonly paymentMethodId: string;
}
