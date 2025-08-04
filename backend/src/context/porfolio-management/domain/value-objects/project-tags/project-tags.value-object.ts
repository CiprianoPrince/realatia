import { ValueObject } from '@shared/domain/value-objects';

export class ProjectTags extends ValueObject {
    private static readonly MAX_TAGS = 10;
    private static readonly MAX_TAG_LENGTH = 50;

    constructor(private readonly tags: string[]) {
        super();
        if (tags.length > ProjectTags.MAX_TAGS) {
            throw new Error(`Cannot have more than ${ProjectTags.MAX_TAGS} tags`);
        }

        for (const tag of tags) {
            if (tag.length > ProjectTags.MAX_TAG_LENGTH) {
                throw new Error(`Tag cannot exceed ${ProjectTags.MAX_TAG_LENGTH} characters`);
            }
        }
    }

    getTags(): string[] {
        return [...this.tags];
    }

    addTag(tag: string): ProjectTags {
        if (this.tags.includes(tag)) {
            return this;
        }

        if (this.tags.length >= ProjectTags.MAX_TAGS) {
            throw new Error(`Cannot add more than ${ProjectTags.MAX_TAGS} tags`);
        }

        return new ProjectTags([...this.tags, tag]);
    }

    removeTag(tag: string): ProjectTags {
        return new ProjectTags(this.tags.filter((t) => t !== tag));
    }

    equals(other: ValueObject): boolean {
        if (!(other instanceof ProjectTags)) return false;

        if (this.tags.length !== other.tags.length) return false;

        const sortedThis = [...this.tags].sort();
        const sortedOther = [...other.tags].sort();

        return sortedThis.every((tag, index) => tag === sortedOther[index]);
    }

    toString(): string {
        return this.tags.join(', ');
    }
}
