import { Entity } from '@shared/domain/entities';
import { Message } from '../message/message.entity';

export class MessageThread extends Entity<string> {
    private messages: Message[] = [];

    constructor(
        id: string,
        private readonly initialMessage: Message,
        private readonly createdAt: Date = new Date()
    ) {
        super(id);
        this.messages.push(initialMessage);
    }

    static create(initialMessage: Message): MessageThread {
        const id = `thread_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new MessageThread(id, initialMessage);
    }

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    getMessages(): Message[] {
        return [...this.messages];
    }

    getMessageCount(): number {
        return this.messages.length;
    }

    getLastMessage(): Message {
        return this.messages[this.messages.length - 1];
    }

    getInitialMessage(): Message {
        return this.initialMessage;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
}
