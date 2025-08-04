import { IDomainEvent } from '@shared/domain/types';

export interface CertificationAdded extends IDomainEvent {
    readonly eventType: 'CertificationAdded';
    readonly userId: string;
    readonly businessProfileId: string;
    readonly certificationName: string;
    readonly issuedBy: string;
}
