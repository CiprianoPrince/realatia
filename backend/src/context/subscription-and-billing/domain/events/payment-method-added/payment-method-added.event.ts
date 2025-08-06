import { IDomainEvent } from '@shared/domain/types';
import { EPaymentMethodType } from '../../types';

export interface PaymentMethodAdded extends IDomainEvent {
    readonly eventType: 'PaymentMethodAdded';
    readonly userId: string;
    readonly paymentMethodId: string;
    readonly paymentMethodType: EPaymentMethodType;
}
