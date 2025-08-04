import { IDomainEvent } from '@shared/domain/types';

export interface ChapterJoined extends IDomainEvent {
    readonly eventType: 'ChapterJoined';
    readonly userId: string;
    readonly chapterId: string;
    readonly chapterName: string;
    readonly membershipId: string;
}
