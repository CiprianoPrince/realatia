import { IDomainEvent } from '@shared/domain/types';

export interface UserLoggedIn extends IDomainEvent {
    readonly eventType: 'UserLoggedIn';
    readonly userId: string;
    readonly loginTimestamp: Date;
    readonly ipAddress: string;
}
