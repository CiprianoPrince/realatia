import { IDomainEvent } from '@shared/domain/types';

export interface PaymentMethodUpdated extends IDomainEvent {
    readonly eventType: 'PaymentMethodUpdated';
    readonly userId: string;
    readonly paymentMethodId: string;
    readonly updatedFields: string[];
}
