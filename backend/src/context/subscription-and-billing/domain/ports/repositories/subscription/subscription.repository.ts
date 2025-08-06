import { UserId } from '@shared/domain/value-objects';
import { Subscription } from '../../../aggregates';
import { SubscriptionId } from '../../../value-objects';

export interface SubscriptionRepository {
    save(subscription: Subscription): Promise<void>;
    findById(id: SubscriptionId): Promise<Subscription | null>;
    findByUserId(userId: UserId): Promise<Subscription | null>;
    findActiveSubscriptions(): Promise<Subscription[]>;
    findExpiringSubscriptions(days: number): Promise<Subscription[]>;
    delete(id: SubscriptionId): Promise<void>;
}
