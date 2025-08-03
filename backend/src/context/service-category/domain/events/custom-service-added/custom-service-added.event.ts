import { IDomainEvent } from '@shared/domain/types';

export interface CustomServiceAdded extends IDomainEvent {
    readonly eventType: 'CustomServiceAdded';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly serviceName: string;
}
