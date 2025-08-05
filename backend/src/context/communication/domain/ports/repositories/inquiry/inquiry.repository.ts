import { UserId } from '@shared/domain/value-objects';
import { Inquiry } from '../../../aggregates';
import { EInquiryCategory, EInquiryStatus } from '../../../types';
import { InquiryId } from '../../../value-objects';

export interface InquiryRepository {
    save(inquiry: Inquiry): Promise<void>;
    findById(id: InquiryId): Promise<Inquiry | null>;
    findByRecipientId(recipientId: UserId): Promise<Inquiry[]>;
    findByStatus(status: EInquiryStatus): Promise<Inquiry[]>;
    findByCategory(category: EInquiryCategory): Promise<Inquiry[]>;
    findOverdueInquiries(): Promise<Inquiry[]>;
    delete(id: InquiryId): Promise<void>;
}
