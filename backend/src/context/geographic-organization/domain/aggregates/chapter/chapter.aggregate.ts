import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import { ChapterEvent, ChapterMembership } from '../../entities';
import {
	ChapterActivityUpdated,
	ChapterEventCreated,
	ChapterJoined,
	ChapterLeft,
	MembershipRoleChanged,
} from '../../events';
import { EActivityLevel, EMeetingFrequency, EMembershipRole } from '../../types';
import { ChapterId, ChapterName, MemberCount, MembershipId, State } from '../../value-objects';

export class Chapter extends AggregateRoot<ChapterId> {
    private memberships: ChapterMembership[] = [];
    private events: ChapterEvent[] = [];

    private constructor(
        id: ChapterId,
        private name: ChapterName,
        private state: State,
        private memberCount: MemberCount = new MemberCount(0),
        private activityLevel: EActivityLevel = EActivityLevel.LOW_ACTIVITY,
        private meetingFrequency: EMeetingFrequency = EMeetingFrequency.MONTHLY,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(
        name: ChapterName,
        state: State,
        meetingFrequency: EMeetingFrequency = EMeetingFrequency.MONTHLY
    ): Chapter {
        const chapterId = ChapterId.generate();
        return new Chapter(chapterId, name, state, new MemberCount(0), EActivityLevel.LOW_ACTIVITY, meetingFrequency);
    }

    // Factory method for reconstruction from persistence
    static fromPersistence(
        id: ChapterId,
        name: ChapterName,
        state: State,
        memberCount: MemberCount,
        activityLevel: EActivityLevel,
        meetingFrequency: EMeetingFrequency,
        createdAt: Date,
        updatedAt: Date
    ): Chapter {
        return new Chapter(id, name, state, memberCount, activityLevel, meetingFrequency, createdAt, updatedAt);
    }

    addMember(userId: UserId, role: EMembershipRole = EMembershipRole.MEMBER): ChapterMembership {
        // Check if user is already a member
        const existingMembership = this.memberships.find((m) => m.getUserId().equals(userId));
        if (existingMembership && existingMembership.isActive()) {
            throw new Error('User is already an active member of this chapter');
        }

        const membership = ChapterMembership.create(userId, this.getId(), role);
        this.memberships.push(membership);
        this.memberCount = this.memberCount.increment();
        this.updatedAt = new Date();
        this.updateActivityLevel();

        const chapterJoinedEvent: ChapterJoined = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ChapterJoined',
            occurredOn: new Date(),
            userId: userId.getValue(),
            chapterId: this.getId().getValue(),
            chapterName: this.name.getValue(),
            membershipId: membership.getId().getValue(),
        };

        this.addDomainEvent(chapterJoinedEvent);

        return membership;
    }

    removeMember(membershipId: MembershipId): void {
        const membership = this.memberships.find((m) => m.getId().equals(membershipId));
        if (!membership) {
            throw new Error('Membership not found');
        }

        if (!membership.isActive()) {
            throw new Error('Cannot remove inactive membership');
        }

        membership.deactivate();
        this.memberCount = this.memberCount.decrement();
        this.updatedAt = new Date();
        this.updateActivityLevel();

        const chapterLeftEvent: ChapterLeft = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ChapterLeft',
            occurredOn: new Date(),
            userId: membership.getUserId().getValue(),
            chapterId: this.getId().getValue(),
            membershipId: membershipId.getValue(),
        };

        this.addDomainEvent(chapterLeftEvent);
    }

    promoteMemberToLeader(membershipId: MembershipId): void {
        const membership = this.memberships.find((m) => m.getId().equals(membershipId));
        if (!membership) {
            throw new Error('Membership not found');
        }

        const oldRole = membership.getRole();
        membership.promoteToLeader();
        this.updatedAt = new Date();

        const roleChangedEvent: MembershipRoleChanged = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'MembershipRoleChanged',
            occurredOn: new Date(),
            userId: membership.getUserId().getValue(),
            chapterId: this.getId().getValue(),
            membershipId: membershipId.getValue(),
            oldRole,
            newRole: membership.getRole(),
        };

        this.addDomainEvent(roleChangedEvent);
    }

    createEvent(title: string, description: string, eventDate: Date, location: string, capacity: number): ChapterEvent {
        const event = ChapterEvent.create(title, description, eventDate, location, capacity, this.getId());
        this.events.push(event);
        this.updatedAt = new Date();
        this.updateActivityLevel();

        const eventCreatedEvent: ChapterEventCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ChapterEventCreated',
            occurredOn: new Date(),
            chapterId: this.getId().getValue(),
            eventId: event.getId(),
            eventTitle: title,
            eventDate,
        };

        this.addDomainEvent(eventCreatedEvent);

        return event;
    }

    private updateActivityLevel(): void {
        const oldLevel = this.activityLevel;
        const memberCount = this.memberCount.getCount();
        const recentEventsCount = this.getRecentEventsCount();

        // Activity level calculation logic
        if (memberCount >= 50 && recentEventsCount >= 4) {
            this.activityLevel = EActivityLevel.VERY_ACTIVE;
        } else if (memberCount >= 20 && recentEventsCount >= 2) {
            this.activityLevel = EActivityLevel.MODERATELY_ACTIVE;
        } else {
            this.activityLevel = EActivityLevel.LOW_ACTIVITY;
        }

        if (oldLevel !== this.activityLevel) {
            const activityUpdatedEvent: ChapterActivityUpdated = {
                eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                eventType: 'ChapterActivityUpdated',
                occurredOn: new Date(),
                chapterId: this.getId().getValue(),
                oldActivityLevel: oldLevel,
                newActivityLevel: this.activityLevel,
            };

            this.addDomainEvent(activityUpdatedEvent);
        }
    }

    private getRecentEventsCount(): number {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        return this.events.filter(
            (event) => event.getEventDate() >= threeMonthsAgo && event.getEventDate() <= new Date()
        ).length;
    }

    getActiveMemberships(): ChapterMembership[] {
        return this.memberships.filter((m) => m.isActive());
    }

    getLeaders(): ChapterMembership[] {
        return this.memberships.filter(
            (m) => m.isActive() && (m.getRole() === EMembershipRole.LEADER || m.getRole() === EMembershipRole.ADMIN)
        );
    }

    getUpcomingEvents(): ChapterEvent[] {
        const now = new Date();
        return this.events.filter((event) => event.getEventDate() > now);
    }

    // Getters
    getName(): ChapterName {
        return this.name;
    }
    getState(): State {
        return this.state;
    }
    getMemberCount(): MemberCount {
        return this.memberCount;
    }
    getActivityLevel(): EActivityLevel {
        return this.activityLevel;
    }
    getMeetingFrequency(): EMeetingFrequency {
        return this.meetingFrequency;
    }
    getMemberships(): ChapterMembership[] {
        return [...this.memberships];
    }
    getEvents(): ChapterEvent[] {
        return [...this.events];
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
