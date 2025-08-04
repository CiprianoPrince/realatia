import { IDomainEvent } from '@shared/domain/types';
import { EMembershipRole } from '../../types';

export interface MembershipRoleChanged extends IDomainEvent {
    readonly eventType: 'MembershipRoleChanged';
    readonly userId: string;
    readonly chapterId: string;
    readonly membershipId: string;
    readonly oldRole: EMembershipRole;
    readonly newRole: EMembershipRole;
}
