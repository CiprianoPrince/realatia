import { IDomainEvent } from '@shared/domain/types';

export interface BusinessProfileCreated extends IDomainEvent {
    readonly eventType: 'BusinessProfileCreated';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly companyName: string;
}
