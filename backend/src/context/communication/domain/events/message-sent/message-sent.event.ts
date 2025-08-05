import { IDomainEvent } from '@shared/domain/types';
import { EMessageType } from '../../types';

export interface MessageSent extends IDomainEvent {
    readonly eventType: 'MessageSent';
    readonly conversationId: string;
    readonly messageId: string;
    readonly senderId: string;
    readonly messageType: EMessageType;
    readonly hasAttachments: boolean;
}
