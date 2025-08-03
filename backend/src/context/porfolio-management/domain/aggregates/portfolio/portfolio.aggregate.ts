import { AggregateRoot } from '@shared/domain/aggregates';
import { BusinessProfileId, UserId } from '@shared/domain/value-objects';
import { Project, ProjectMedia } from '../../entities';
import { MediaUploaded, PortfolioCreated, ProjectAdded, ProjectRemoved, ProjectUpdated } from '../../events';
import { EProjectType } from '../../types';
import { PortfolioId, ProjectDescription, ProjectTags, ProjectTitle } from '../../value-objects';

export class Portfolio extends AggregateRoot<PortfolioId> {
    private projects: Project[] = [];

    private constructor(
        id: PortfolioId,
        private readonly userId: UserId,
        private readonly businessProfileId: BusinessProfileId,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(userId: UserId, businessProfileId: BusinessProfileId): Portfolio {
        const portfolioId = PortfolioId.generate();

        const portfolio = new Portfolio(portfolioId, userId, businessProfileId);

        const portfolioCreatedEvent: PortfolioCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PortfolioCreated',
            occurredOn: new Date(),
            userId: userId.getValue(),
            portfolioId: portfolioId.getValue(),
        };

        portfolio.addDomainEvent(portfolioCreatedEvent);

        return portfolio;
    }

    addProject(project: Project): void {
        this.projects.push(project);
        this.updatedAt = new Date();

        const projectAddedEvent: ProjectAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ProjectAdded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            portfolioId: this.getId().getValue(),
            projectId: project.getId(),
            projectTitle: project.getTitle().getValue(),
            projectType: project.getProjectType(),
        };

        this.addDomainEvent(projectAddedEvent);
    }

    removeProject(projectId: string): void {
        const project = this.projects.find((p) => p.getId() === projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        this.projects = this.projects.filter((p) => p.getId() !== projectId);
        this.updatedAt = new Date();

        const projectRemovedEvent: ProjectRemoved = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ProjectRemoved',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            portfolioId: this.getId().getValue(),
            projectId,
        };

        this.addDomainEvent(projectRemovedEvent);
    }

    updateProject(
        projectId: string,
        updates: Partial<{
            title: ProjectTitle;
            description: ProjectDescription;
            tags: ProjectTags;
        }>
    ): void {
        const project = this.projects.find((p) => p.getId() === projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const updatedFields: string[] = [];

        if (updates.title) {
            project.updateTitle(updates.title);
            updatedFields.push('title');
        }

        if (updates.description) {
            project.updateDescription(updates.description);
            updatedFields.push('description');
        }

        if (updates.tags) {
            project.updateTags(updates.tags);
            updatedFields.push('tags');
        }

        this.updatedAt = new Date();

        const projectUpdatedEvent: ProjectUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ProjectUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            portfolioId: this.getId().getValue(),
            projectId,
            updatedFields,
        };

        this.addDomainEvent(projectUpdatedEvent);
    }

    addMediaToProject(projectId: string, media: ProjectMedia): void {
        const project = this.projects.find((p) => p.getId() === projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        project.addMedia(media);
        this.updatedAt = new Date();

        const mediaUploadedEvent: MediaUploaded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'MediaUploaded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            portfolioId: this.getId().getValue(),
            projectId,
            mediaId: media.getId(),
            mediaType: media.getMediaType(),
        };

        this.addDomainEvent(mediaUploadedEvent);
    }

    removeMediaFromProject(projectId: string, mediaId: string): void {
        const project = this.projects.find((p) => p.getId() === projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        project.removeMedia(mediaId);
        this.updatedAt = new Date();
    }

    getProjectsByType(projectType: EProjectType): Project[] {
        return this.projects.filter((p) => p.getProjectType() === projectType);
    }

    getProjectsByTag(tag: string): Project[] {
        return this.projects.filter((p) => p.getTags().getTags().includes(tag));
    }

    getProjectsCompletedInYear(year: number): Project[] {
        return this.projects.filter((p) => p.getCompletionYear().getYear() === year);
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getBusinessProfileId(): BusinessProfileId {
        return this.businessProfileId;
    }
    getProjects(): Project[] {
        return [...this.projects];
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getProjectCount(): number {
        return this.projects.length;
    }

    getTotalMediaCount(): number {
        return this.projects.reduce((total, project) => total + project.getMedia().length, 0);
    }
}
