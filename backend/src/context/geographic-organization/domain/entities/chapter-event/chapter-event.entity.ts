import { Entity } from '@shared/domain/entities';
import { UserId } from '@shared/domain/value-objects';
import { EMembershipRole, EMembershipStatus } from '../../types';
import { ChapterId, MembershipId } from '../../value-objects/';

export class ChapterEvent extends Entity<string> {
    constructor(
        id: string,
        private title: string,
        private description: string,
        private eventDate: Date,
        private location: string,
        private capacity: number,
        private readonly chapterId: ChapterId,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
        if (!title || !description || !location) {
            throw new Error('Event title, description, and location are required');
        }
        if (capacity <= 0) {
            throw new Error('Event capacity must be positive');
        }
    }

    static create(
        title: string,
        description: string,
        eventDate: Date,
        location: string,
        capacity: number,
        chapterId: ChapterId
    ): ChapterEvent {
        const id = `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new ChapterEvent(id, title, description, eventDate, location, capacity, chapterId);
    }

    updateTitle(title: string): void {
        if (!title) throw new Error('Event title cannot be empty');
        this.title = title;
        this.updatedAt = new Date();
    }

    updateDescription(description: string): void {
        if (!description) throw new Error('Event description cannot be empty');
        this.description = description;
        this.updatedAt = new Date();
    }

    updateEventDate(eventDate: Date): void {
        if (eventDate < new Date()) {
            throw new Error('Cannot set event date in the past');
        }
        this.eventDate = eventDate;
        this.updatedAt = new Date();
    }

    getTitle(): string {
        return this.title;
    }
    getDescription(): string {
        return this.description;
    }
    getEventDate(): Date {
        return this.eventDate;
    }
    getLocation(): string {
        return this.location;
    }
    getCapacity(): number {
        return this.capacity;
    }
    getChapterId(): ChapterId {
        return this.chapterId;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}

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
