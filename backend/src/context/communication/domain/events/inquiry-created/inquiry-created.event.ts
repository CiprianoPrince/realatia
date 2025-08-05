import { IDomainEvent } from '@shared/domain/types';
import { EInquiryCategory } from '../../types';

export interface InquiryCreated extends IDomainEvent {
    readonly eventType: 'InquiryCreated';
    readonly inquiryId: string;
    readonly recipientId: string;
    readonly requesterInfo: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
    };
    readonly subject: string;
    readonly category: EInquiryCategory;
    readonly priority: EInquiryCategory;
}
