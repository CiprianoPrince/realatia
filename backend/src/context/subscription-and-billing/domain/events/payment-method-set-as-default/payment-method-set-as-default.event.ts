import { IDomainEvent } from '@shared/domain/types';

export interface PaymentMethodSetAsDefault extends IDomainEvent {
    readonly eventType: 'PaymentMethodSetAsDefault';
    readonly userId: string;
    readonly paymentMethodId: string;
}
