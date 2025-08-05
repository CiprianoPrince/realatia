import { Entity } from '@shared/domain/entities';
import { UserId } from '@shared/domain/value-objects';
import { MessageContent } from 'src/context/communication/domain/value-objects';

export class Message extends Entity<string> {
    constructor(
        id: string,
        private readonly senderId: UserId,
        private content: MessageContent,
        private isRead: boolean = false,
        private isEdited: boolean = false,
        private readonly sentAt: Date = new Date(),
        private editedAt?: Date
    ) {
        super(id);
    }

    static create(senderId: UserId, content: MessageContent): Message {
        const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new Message(id, senderId, content);
    }

    markAsRead(): void {
        this.isRead = true;
    }

    editContent(newContent: MessageContent): void {
        if (this.sentAt < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            throw new Error('Cannot edit messages older than 24 hours');
        }

        this.content = newContent;
        this.isEdited = true;
        this.editedAt = new Date();
    }

    getSenderId(): UserId {
        return this.senderId;
    }
    getContent(): MessageContent {
        return this.content;
    }
    isMessageRead(): boolean {
        return this.isRead;
    }
    isMessageEdited(): boolean {
        return this.isEdited;
    }
    getSentAt(): Date {
        return this.sentAt;
    }
    getEditedAt(): Date | undefined {
        return this.editedAt;
    }
}
