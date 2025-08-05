import { ValueObject } from '@shared/domain/value-objects';
import { EMessageType } from '../../types';

export class MessageContent extends ValueObject {
    private static readonly MAX_LENGTH = 5000;

    constructor(
        private readonly text: string,
        private readonly messageType: EMessageType = EMessageType.TEXT,
        private readonly attachments: string[] = []
    ) {
        super();
        if (!text || text.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }
        if (text.length > MessageContent.MAX_LENGTH) {
            throw new Error(`Message content cannot exceed ${MessageContent.MAX_LENGTH} characters`);
        }
    }

    getText(): string {
        return this.text;
    }
    getMessageType(): EMessageType {
        return this.messageType;
    }
    getAttachments(): string[] {
        return [...this.attachments];
    }

    hasAttachments(): boolean {
        return this.attachments.length > 0;
    }

    equals(other: ValueObject): boolean {
        return other instanceof MessageContent && this.text === other.text && this.messageType === other.messageType;
    }

    toString(): string {
        return this.text;
    }
}
