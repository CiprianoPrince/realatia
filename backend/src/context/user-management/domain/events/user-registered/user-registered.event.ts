import { IDomainEvent } from '@shared/domain/types';

export interface UserRegistered extends IDomainEvent {
    readonly eventType: 'UserRegistered';
    readonly userId: string;
    readonly email: string;
    readonly fullName: string;
}
