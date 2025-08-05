import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import {
	ConversationArchived,
	ConversationStarted,
	MessageRead,
	MessageSent,
} from 'src/context/communication/domain/events';
import { Message, MessageThread } from '../../entities';
import { EConversationStatus, EConversationType } from '../../types';
import { ConversationId, ParticipantIds } from '../../value-objects';

export class Conversation extends AggregateRoot<ConversationId> {
    private threads: MessageThread[] = [];

    private constructor(
        id: ConversationId,
        private readonly initiatorId: UserId,
        private participants: ParticipantIds,
        private readonly conversationType: EConversationType,
        private status: EConversationType = EConversationType.ACTIVE,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static startDirectConversation(initiatorId: UserId, recipientId: UserId, initialMessage: Message): Conversation {
        const conversationId = ConversationId.generate();
        const participants = new ParticipantIds([initiatorId, recipientId]);

        const conversation = new Conversation(conversationId, initiatorId, participants, EConversationType.DIRECT);

        const initialThread = MessageThread.create(initialMessage);
        conversation.threads.push(initialThread);

        const conversationStartedEvent: ConversationStarted = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ConversationStarted',
            occurredOn: new Date(),
            conversationId: conversationId.getValue(),
            initiatorId: initiatorId.getValue(),
            participantIds: participants.getUserIds().map((id) => id.getValue()),
            conversationType: EConversationType.DIRECT,
        };

        const messageSentEvent: MessageSent = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'MessageSent',
            occurredOn: new Date(),
            conversationId: conversationId.getValue(),
            messageId: initialMessage.getId(),
            senderId: initialMessage.getSenderId().getValue(),
            messageType: initialMessage.getContent().getMessageType(),
            hasAttachments: initialMessage.getContent().hasAttachments(),
        };

        conversation.addDomainEvent(conversationStartedEvent);
        conversation.addDomainEvent(messageSentEvent);

        return conversation;
    }

    static createGroupConversation(
        initiatorId: UserId,
        participantIds: UserId[],
        initialMessage: Message
    ): Conversation {
        const conversationId = ConversationId.generate();
        const allParticipants = [initiatorId, ...participantIds];
        const participants = new ParticipantIds(allParticipants);

        const conversation = new Conversation(conversationId, initiatorId, participants, EConversationType.GROUP);

        const initialThread = MessageThread.create(initialMessage);
        conversation.threads.push(initialThread);

        const conversationStartedEvent: ConversationStarted = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ConversationStarted',
            occurredOn: new Date(),
            conversationId: conversationId.getValue(),
            initiatorId: initiatorId.getValue(),
            participantIds: participants.getUserIds().map((id) => id.getValue()),
            conversationType: EConversationType.GROUP,
        };

        conversation.addDomainEvent(conversationStartedEvent);

        return conversation;
    }

    sendMessage(message: Message): void {
        if (this.status !== EConversationStatus.ACTIVE) {
            throw new Error('Cannot send message to inactive conversation');
        }

        if (!this.participants.hasParticipant(message.getSenderId())) {
            throw new Error('Sender is not a participant in this conversation');
        }

        // Find or create thread
        let thread = this.threads[this.threads.length - 1]; // Use most recent thread
        if (!thread) {
            thread = MessageThread.create(message);
            this.threads.push(thread);
        } else {
            thread.addMessage(message);
        }

        this.updatedAt = new Date();

        const messageSentEvent: MessageSent = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'MessageSent',
            occurredOn: new Date(),
            conversationId: this.getId().getValue(),
            messageId: message.getId(),
            senderId: message.getSenderId().getValue(),
            messageType: message.getContent().getMessageType(),
            hasAttachments: message.getContent().hasAttachments(),
        };

        this.addDomainEvent(messageSentEvent);
    }

    markMessageAsRead(messageId: string, readByUserId: UserId): void {
        if (!this.participants.hasParticipant(readByUserId)) {
            throw new Error('User is not a participant in this conversation');
        }

        for (const thread of this.threads) {
            const message = thread.getMessages().find((m) => m.getId() === messageId);
            if (message) {
                message.markAsRead();

                const messageReadEvent: MessageRead = {
                    eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                    eventType: 'MessageRead',
                    occurredOn: new Date(),
                    conversationId: this.getId().getValue(),
                    messageId,
                    readByUserId: readByUserId.getValue(),
                };

                this.addDomainEvent(messageReadEvent);
                break;
            }
        }
    }

    addParticipant(userId: UserId, addedByUserId: UserId): void {
        if (this.conversationType === EConversationType.DIRECT) {
            throw new Error('Cannot add participants to direct conversation');
        }

        if (!this.participants.hasParticipant(addedByUserId)) {
            throw new Error('Only participants can add new members');
        }

        this.participants = this.participants.addParticipant(userId);
        this.updatedAt = new Date();
    }

    removeParticipant(userId: UserId, removedByUserId: UserId): void {
        if (this.conversationType === EConversationType.DIRECT) {
            throw new Error('Cannot remove participants from direct conversation');
        }

        if (!this.participants.hasParticipant(removedByUserId)) {
            throw new Error('Only participants can remove members');
        }

        this.participants = this.participants.removeParticipant(userId);
        this.updatedAt = new Date();
    }

    archive(archivedByUserId: UserId): void {
        if (!this.participants.hasParticipant(archivedByUserId)) {
            throw new Error('Only participants can archive conversation');
        }

        this.status = EConversationStatus.ARCHIVED;
        this.updatedAt = new Date();

        const conversationArchivedEvent: ConversationArchived = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ConversationArchived',
            occurredOn: new Date(),
            conversationId: this.getId().getValue(),
            archivedByUserId: archivedByUserId.getValue(),
        };

        this.addDomainEvent(conversationArchivedEvent);
    }

    block(blockedByUserId: UserId): void {
        if (!this.participants.hasParticipant(blockedByUserId)) {
            throw new Error('Only participants can block conversation');
        }

        this.status = EConversationStatus.BLOCKED;
        this.updatedAt = new Date();
    }

    getAllMessages(): Message[] {
        return this.threads.flatMap((thread) => thread.getMessages());
    }

    getUnreadMessages(userId: UserId): Message[] {
        return this.getAllMessages().filter(
            (message) => !message.getSenderId().equals(userId) && !message.isMessageRead()
        );
    }

    getLastMessage(): Message | undefined {
        const allMessages = this.getAllMessages();
        return allMessages.length > 0 ? allMessages[allMessages.length - 1] : undefined;
    }

    // Getters
    getInitiatorId(): UserId {
        return this.initiatorId;
    }
    getParticipants(): ParticipantIds {
        return this.participants;
    }
    getConversationType(): EConversationType {
        return this.conversationType;
    }
    getStatus(): EConversationStatus {
        return this.status;
    }
    getThreads(): MessageThread[] {
        return [...this.threads];
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    isActive(): boolean {
        return this.status === EConversationStatus.ACTIVE;
    }

    getMessageCount(): number {
        return this.getAllMessages().length;
    }
}
