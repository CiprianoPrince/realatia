import { UserId } from '@shared/domain/value-objects';
import { BillingHistory } from '../../../entities';
import { SubscriptionId } from '../../../value-objects';

export interface BillingHistoryRepository {
    save(billingHistory: BillingHistory): Promise<void>;
    findById(id: string): Promise<BillingHistory | null>;
    findBySubscriptionId(subscriptionId: SubscriptionId): Promise<BillingHistory[]>;
    findByUserId(userId: UserId): Promise<BillingHistory[]>;
    findFailedPayments(): Promise<BillingHistory[]>;
}
