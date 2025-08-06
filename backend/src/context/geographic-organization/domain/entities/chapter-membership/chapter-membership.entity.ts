import { Entity } from '@shared/domain/entities';
import { UserId } from '@shared/domain/value-objects';
import { EMembershipRole, EMembershipStatus } from '../../types';
import { ChapterId, MembershipId } from '../../value-objects';

export class ChapterMembership extends Entity<MembershipId> {
    constructor(
        id: MembershipId,
        private readonly userId: UserId,
        private readonly chapterId: ChapterId,
        private role: EMembershipRole,
        private status: EMembershipStatus,
        private readonly joinDate: Date = new Date(),
        private lastActiveDate: Date = new Date()
    ) {
        super(id);
    }

    static create(
        userId: UserId,
        chapterId: ChapterId,
        role: EMembershipRole = EMembershipRole.MEMBER
    ): ChapterMembership {
        const membershipId = MembershipId.generate();
        return new ChapterMembership(membershipId, userId, chapterId, role, EMembershipStatus.ACTIVE);
    }

    promoteToLeader(): void {
        if (this.status !== EMembershipStatus.ACTIVE) {
            throw new Error('Cannot promote inactive member');
        }
        this.role = EMembershipRole.LEADER;
        this.updateActivity();
    }

    promoteToAdmin(): void {
        if (this.status !== EMembershipStatus.ACTIVE) {
            throw new Error('Cannot promote inactive member');
        }
        this.role = EMembershipRole.ADMIN;
        this.updateActivity();
    }

    demoteToMember(): void {
        this.role = EMembershipRole.MEMBER;
        this.updateActivity();
    }

    suspend(): void {
        this.status = EMembershipStatus.SUSPENDED;
        this.updateActivity();
    }

    reactivate(): void {
        if (this.status === EMembershipStatus.SUSPENDED) {
            this.status = EMembershipStatus.ACTIVE;
        }
        this.updateActivity();
    }

    deactivate(): void {
        this.status = EMembershipStatus.INACTIVE;
        this.updateActivity();
    }

    private updateActivity(): void {
        this.lastActiveDate = new Date();
    }

    isActive(): boolean {
        return this.status === EMembershipStatus.ACTIVE;
    }

    canManageChapter(): boolean {
        return this.isActive() && (this.role === EMembershipRole.ADMIN || this.role === EMembershipRole.LEADER);
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getChapterId(): ChapterId {
        return this.chapterId;
    }
    getRole(): EMembershipRole {
        return this.role;
    }
    getStatus(): EMembershipStatus {
        return this.status;
    }
    getJoinDate(): Date {
        return this.joinDate;
    }
    getLastActiveDate(): Date {
        return this.lastActiveDate;
    }
}
