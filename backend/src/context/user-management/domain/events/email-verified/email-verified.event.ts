import { IDomainEvent } from '@shared/domain/types';

export interface EmailVerified extends IDomainEvent {
    readonly eventType: 'EmailVerified';
    readonly userId: string;
    readonly email: string;
}
