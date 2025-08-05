import { IDomainEvent } from '@shared/domain/types';

export interface ConversationArchived extends IDomainEvent {
    readonly eventType: 'ConversationArchived';
    readonly conversationId: string;
    readonly archivedByUserId: string;
}
