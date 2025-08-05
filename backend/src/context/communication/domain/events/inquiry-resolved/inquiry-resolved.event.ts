import { IDomainEvent } from '@shared/domain/types';

export interface InquiryResolved extends IDomainEvent {
    readonly eventType: 'InquiryResolved';
    readonly inquiryId: string;
    readonly resolvedByUserId: string;
    readonly resolutionNotes?: string;
}
