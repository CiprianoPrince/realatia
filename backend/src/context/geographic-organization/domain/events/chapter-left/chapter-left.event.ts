import { IDomainEvent } from '@shared/domain/types';

export interface ChapterLeft extends IDomainEvent {
    readonly eventType: 'ChapterLeft';
    readonly userId: string;
    readonly chapterId: string;
    readonly membershipId: string;
}
