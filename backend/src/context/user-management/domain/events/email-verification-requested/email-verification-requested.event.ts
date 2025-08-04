import { IDomainEvent } from '@shared/domain/types';

export interface EmailVerificationRequested extends IDomainEvent {
    readonly eventType: 'EmailVerificationRequested';
    readonly userId: string;
    readonly email: string;
    readonly verificationCode: string;
}
