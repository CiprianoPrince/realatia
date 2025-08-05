import { IDomainEvent } from '@shared/domain/types';
import { EInquiryStatus } from '../../types';

export interface InquiryStatusChanged extends IDomainEvent {
    readonly eventType: 'InquiryStatusChanged';
    readonly inquiryId: string;
    readonly oldStatus: EInquiryStatus;
    readonly newStatus: EInquiryStatus;
    readonly changedByUserId: string;
}
