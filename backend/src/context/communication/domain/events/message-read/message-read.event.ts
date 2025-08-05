import { IDomainEvent } from '@shared/domain/types';

export interface MessageRead extends IDomainEvent {
    readonly eventType: 'MessageRead';
    readonly conversationId: string;
    readonly messageId: string;
    readonly readByUserId: string;
}
