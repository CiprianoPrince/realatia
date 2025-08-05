import { IDomainEvent } from '@shared/domain/types';

export interface InquiryAssigned extends IDomainEvent {
    readonly eventType: 'InquiryAssigned';
    readonly inquiryId: string;
    readonly assignedToUserId: string;
    readonly assignedByUserId: string;
}
