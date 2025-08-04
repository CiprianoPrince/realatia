import { Entity } from '@shared/domain/entities';
import { EMediaType, EProjectType } from '../../types';
import { CompletionYear, ProjectDescription, ProjectTags, ProjectTitle } from '../../value-objects';

export class ProjectMedia extends Entity<string> {
    constructor(
        id: string,
        private url: string,
        private mediaType: EMediaType,
        private caption?: string,
        private readonly uploadedAt: Date = new Date()
    ) {
        super(id);
        if (!url) {
            throw new Error('Media URL is required');
        }
    }

    static create(url: string, mediaType: EMediaType, caption?: string): ProjectMedia {
        const id = `media_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new ProjectMedia(id, url, mediaType, caption);
    }

    getUrl(): string {
        return this.url;
    }
    getMediaType(): EMediaType {
        return this.mediaType;
    }
    getCaption(): string | undefined {
        return this.caption;
    }
    getUploadedAt(): Date {
        return this.uploadedAt;
    }

    updateCaption(caption: string): void {
        this.caption = caption;
    }

    updateUrl(url: string): void {
        if (!url) throw new Error('Media URL cannot be empty');
        this.url = url;
    }
}

export class Project extends Entity<string> {
    private media: ProjectMedia[] = [];

    constructor(
        id: string,
        private title: ProjectTitle,
        private description: ProjectDescription,
        private completionYear: CompletionYear,
        private projectType: EProjectType,
        private tags: ProjectTags,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(
        title: ProjectTitle,
        description: ProjectDescription,
        completionYear: CompletionYear,
        projectType: EProjectType,
        tags: ProjectTags = new ProjectTags([])
    ): Project {
        const id = `project_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new Project(id, title, description, completionYear, projectType, tags);
    }

    updateTitle(title: ProjectTitle): void {
        this.title = title;
        this.updatedAt = new Date();
    }

    updateDescription(description: ProjectDescription): void {
        this.description = description;
        this.updatedAt = new Date();
    }

    updateTags(tags: ProjectTags): void {
        this.tags = tags;
        this.updatedAt = new Date();
    }

    addMedia(media: ProjectMedia): void {
        this.media.push(media);
        this.updatedAt = new Date();
    }

    removeMedia(mediaId: string): void {
        this.media = this.media.filter((m) => m.getId() !== mediaId);
        this.updatedAt = new Date();
    }

    getTitle(): ProjectTitle {
        return this.title;
    }
    getDescription(): ProjectDescription {
        return this.description;
    }
    getCompletionYear(): CompletionYear {
        return this.completionYear;
    }
    getProjectType(): EProjectType {
        return this.projectType;
    }
    getTags(): ProjectTags {
        return this.tags;
    }
    getMedia(): ProjectMedia[] {
        return [...this.media];
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
