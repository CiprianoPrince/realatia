import { UserId } from '@shared/domain/value-objects';
import { ChapterMembership } from '../../../entities';
import { ChapterId, MembershipId } from '../../../value-objects';

export interface ChapterMembershipRepository {
    save(membership: ChapterMembership): Promise<void>;
    findById(id: MembershipId): Promise<ChapterMembership | null>;
    findByUserId(userId: UserId): Promise<ChapterMembership[]>;
    findByChapterId(chapterId: ChapterId): Promise<ChapterMembership[]>;
    findActiveByUserId(userId: UserId): Promise<ChapterMembership[]>;
    delete(id: MembershipId): Promise<void>;
}
