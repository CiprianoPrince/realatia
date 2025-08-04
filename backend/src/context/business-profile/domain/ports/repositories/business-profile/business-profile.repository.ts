import { UserId } from '@shared/domain/value-objects';
import { BusinessProfile } from '../../../aggregates';
import { EProfileCompletionLevel } from '../../../types';
import { BusinessProfileId } from '../../../value-objects';

export interface BusinessProfileRepository {
    save(profile: BusinessProfile): Promise<void>;
    findById(id: BusinessProfileId): Promise<BusinessProfile | null>;
    findByUserId(userId: UserId): Promise<BusinessProfile | null>;
    delete(id: BusinessProfileId): Promise<void>;
    findAll(): Promise<BusinessProfile[]>;
    findByCompletionLevel(level: EProfileCompletionLevel): Promise<BusinessProfile[]>;
}
