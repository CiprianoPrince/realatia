import { UserId } from '@shared/domain/value-objects';
import { PaymentMethod } from '../../../aggregates';

export interface PaymentMethodRepository {
    save(paymentMethod: PaymentMethod): Promise<void>;
    findById(id: string): Promise<PaymentMethod | null>;
    findByUserId(userId: UserId): Promise<PaymentMethod[]>;
    findDefaultByUserId(userId: UserId): Promise<PaymentMethod | null>;
    delete(id: string): Promise<void>;
}
