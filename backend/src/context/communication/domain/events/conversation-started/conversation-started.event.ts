import { IDomainEvent } from '@shared/domain/types';
import { EConversationType } from '../../types';

export interface ConversationStarted extends IDomainEvent {
    readonly eventType: 'ConversationStarted';
    readonly conversationId: string;
    readonly initiatorId: string;
    readonly participantIds: string[];
    readonly conversationType: EConversationType;
}
