import { UserId } from '@shared/domain/value-objects';
import { Conversation } from '../../../aggregates';
import { ConversationId } from '../../../value-objects';

export interface ConversationRepository {
    save(conversation: Conversation): Promise<void>;
    findById(id: ConversationId): Promise<Conversation | null>;
    findByParticipant(userId: UserId): Promise<Conversation[]>;
    findDirectConversation(user1Id: UserId, user2Id: UserId): Promise<Conversation | null>;
    findActiveConversationsByParticipant(userId: UserId): Promise<Conversation[]>;
    delete(id: ConversationId): Promise<void>;
}
