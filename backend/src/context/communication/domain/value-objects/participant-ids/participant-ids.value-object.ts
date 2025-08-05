import { UserId, ValueObject } from '@shared/domain/value-objects';

export class ParticipantIds extends ValueObject {
    private static readonly MAX_PARTICIPANTS = 50;

    constructor(private readonly userIds: UserId[]) {
        super();
        if (userIds.length === 0) {
            throw new Error('At least one participant is required');
        }
        if (userIds.length > ParticipantIds.MAX_PARTICIPANTS) {
            throw new Error(`Cannot have more than ${ParticipantIds.MAX_PARTICIPANTS} participants`);
        }

        // Remove duplicates
        const uniqueIds = userIds.filter((id, index, self) => index === self.findIndex((other) => id.equals(other)));

        if (uniqueIds.length !== userIds.length) {
            throw new Error('Duplicate participants are not allowed');
        }
    }

    getUserIds(): UserId[] {
        return [...this.userIds];
    }

    hasParticipant(userId: UserId): boolean {
        return this.userIds.some((id) => id.equals(userId));
    }

    addParticipant(userId: UserId): ParticipantIds {
        if (this.hasParticipant(userId)) {
            return this;
        }

        if (this.userIds.length >= ParticipantIds.MAX_PARTICIPANTS) {
            throw new Error(`Cannot add more than ${ParticipantIds.MAX_PARTICIPANTS} participants`);
        }

        return new ParticipantIds([...this.userIds, userId]);
    }

    removeParticipant(userId: UserId): ParticipantIds {
        const filteredIds = this.userIds.filter((id) => !id.equals(userId));

        if (filteredIds.length === 0) {
            throw new Error('Cannot remove all participants');
        }

        return new ParticipantIds(filteredIds);
    }

    getParticipantCount(): number {
        return this.userIds.length;
    }

    equals(other: ValueObject): boolean {
        if (!(other instanceof ParticipantIds)) return false;

        if (this.userIds.length !== other.userIds.length) return false;

        return this.userIds.every((id) => other.userIds.some((otherId) => id.equals(otherId)));
    }

    toString(): string {
        return this.userIds.map((id) => id.getValue()).join(', ');
    }
}
