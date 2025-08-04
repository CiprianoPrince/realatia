import { IDomainEvent } from '@shared/domain/types';
import { EMembershipStatus } from '../../types';

export interface MembershipStatusUpdated extends IDomainEvent {
    readonly eventType: 'MembershipStatusUpdated';
    readonly userId: string;
    readonly chapterId: string;
    readonly membershipId: string;
    readonly oldStatus: EMembershipStatus;
    readonly newStatus: EMembershipStatus;
}
