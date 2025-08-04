import { IDomainEvent } from '@shared/domain/types';
import { EMediaType } from '../../types';

export interface MediaUploaded extends IDomainEvent {
    readonly eventType: 'MediaUploaded';
    readonly userId: string;
    readonly portfolioId: string;
    readonly projectId: string;
    readonly mediaId: string;
    readonly mediaType: EMediaType;
}
