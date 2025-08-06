import { Chapter } from '../../../aggregates';
import { ChapterId, ChapterName, State } from '../../../value-objects';

export interface ChapterRepository {
    save(chapter: Chapter): Promise<void>;
    findById(id: ChapterId): Promise<Chapter | null>;
    findByState(state: State): Promise<Chapter[]>;
    findByName(name: ChapterName): Promise<Chapter | null>;
    findAll(): Promise<Chapter[]>;
    delete(id: ChapterId): Promise<void>;
}
