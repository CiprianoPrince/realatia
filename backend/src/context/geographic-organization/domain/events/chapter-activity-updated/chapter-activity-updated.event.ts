import { IDomainEvent } from '@shared/domain/types';
import { EActivityLevel } from '../../types';

export interface ChapterActivityUpdated extends IDomainEvent {
    readonly eventType: 'ChapterActivityUpdated';
    readonly chapterId: string;
    readonly oldActivityLevel: EActivityLevel;
    readonly newActivityLevel: EActivityLevel;
}
