import { IDomainEvent } from '@shared/domain/types';
import { EProfileCompletionLevel } from '../../types';

export interface ProfileCompletionChanged extends IDomainEvent {
    readonly eventType: 'ProfileCompletionChanged';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly oldCompletionLevel: EProfileCompletionLevel;
    readonly newCompletionLevel: EProfileCompletionLevel;
    readonly completionPercentage: number;
}
