import { IDomainEvent } from '@shared/domain/types';

export interface ChapterEventCreated extends IDomainEvent {
    readonly eventType: 'ChapterEventCreated';
    readonly chapterId: string;
    readonly eventId: string;
    readonly eventTitle: string;
    readonly eventDate: Date;
}
