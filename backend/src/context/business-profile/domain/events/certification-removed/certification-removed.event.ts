import { IDomainEvent } from '@shared/domain/types';

export interface CertificationRemoved extends IDomainEvent {
    readonly eventType: 'CertificationRemoved';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly certificationName: string;
}
