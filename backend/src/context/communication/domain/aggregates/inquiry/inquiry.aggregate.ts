import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import { InquiryAssigned, InquiryResolved, InquiryStatusChanged } from '../../events';
import { EInquiryCategory, EInquiryPriority, EInquiryStatus } from '../../types';
import { InquiryId, MessageContent, RequesterInfo, Subject } from '../../value-objects';

export class Inquiry extends AggregateRoot<InquiryId> {
    private constructor(
        id: InquiryId,
        private readonly recipientId: UserId,
        private readonly subject: Subject,
        private readonly content: MessageContent,
        private readonly category: EInquiryCategory,
        private readonly priority: EInquiryCategory,
        private readonly requesterInfo: RequesterInfo,
        private status: EInquiryStatus = EInquiryStatus.OPEN,
        private assignedToUserId?: UserId,
        private resolutionNotes?: string,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date(),
        private resolvedAt?: Date
    ) {
        super(id);
    }

    static create(
        recipientId: UserId,
        subject: Subject,
        content: MessageContent,
        category: EInquiryStatus,
        requesterInfo: RequesterInfo,
        priority: EInquiryPriority = EInquiryPriority.NORMAL
    ): Inquiry {
        const inquiryId = InquiryId.generate();

        const inquiry = new Inquiry(inquiryId, recipientId, subject, content, category, priority, requesterInfo);

        const inquiryCreatedEvent: InquiryCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'InquiryCreated',
            occurredOn: new Date(),
            inquiryId: inquiryId.getValue(),
            recipientId: recipientId.getValue(),
            requesterInfo: {
                name: requesterInfo.getName(),
                email: requesterInfo.getEmail(),
                phone: requesterInfo.getPhone(),
                company: requesterInfo.getCompany(),
            },
            subject: subject.getValue(),
            category,
            priority,
        };

        inquiry.addDomainEvent(inquiryCreatedEvent);

        return inquiry;
    }

    assignTo(userId: UserId, assignedByUserId: UserId): void {
        if (this.status === EInquiryStatus.CLOSED || this.status === EInquiryStatus.RESOLVED) {
            throw new Error('Cannot assign closed or resolved inquiry');
        }

        this.assignedToUserId = userId;
        this.status = EInquiryStatus.IN_PROGRESS;
        this.updatedAt = new Date();

        const inquiryAssignedEvent: InquiryAssigned = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'InquiryAssigned',
            occurredOn: new Date(),
            inquiryId: this.getId().getValue(),
            assignedToUserId: userId.getValue(),
            assignedByUserId: assignedByUserId.getValue(),
        };

        this.addDomainEvent(inquiryAssignedEvent);
    }

    changeStatus(newStatus: EInquiryStatus, changedByUserId: UserId): void {
        if (this.status === newStatus) {
            return;
        }

        const oldStatus = this.status;
        this.status = newStatus;
        this.updatedAt = new Date();

        const statusChangedEvent: InquiryStatusChanged = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'InquiryStatusChanged',
            occurredOn: new Date(),
            inquiryId: this.getId().getValue(),
            oldStatus,
            newStatus,
            changedByUserId: changedByUserId.getValue(),
        };

        this.addDomainEvent(statusChangedEvent);
    }

    resolve(resolvedByUserId: UserId, resolutionNotes?: string): void {
        if (this.status === EInquiryStatus.RESOLVED || this.status === EInquiryStatus.CLOSED) {
            throw new Error('Inquiry is already resolved or closed');
        }

        this.status = EInquiryStatus.RESOLVED;
        this.resolutionNotes = resolutionNotes;
        this.resolvedAt = new Date();
        this.updatedAt = new Date();

        const inquiryResolvedEvent: InquiryResolved = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'InquiryResolved',
            occurredOn: new Date(),
            inquiryId: this.getId().getValue(),
            resolvedByUserId: resolvedByUserId.getValue(),
            resolutionNotes,
        };

        this.addDomainEvent(inquiryResolvedEvent);
    }

    markAsSpam(): void {
        this.status = EInquiryStatus.SPAM;
        this.updatedAt = new Date();
    }

    isOverdue(): boolean {
        if (this.status === EInquiryStatus.RESOLVED || this.status === EInquiryStatus.CLOSED) {
            return false;
        }

        const hoursElapsed = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);

        switch (this.priority) {
            case EInquiryPriority.URGENT:
                return hoursElapsed > 2;
            case EInquiryPriority.HIGH:
                return hoursElapsed > 24;
            case EInquiryPriority.NORMAL:
                return hoursElapsed > 72;
            case EInquiryPriority.LOW:
                return hoursElapsed > 168; // 1 week
            default:
                return false;
        }
    }

    // Getters
    getRecipientId(): UserId {
        return this.recipientId;
    }
    getSubject(): Subject {
        return this.subject;
    }
    getContent(): MessageContent {
        return this.content;
    }
    getCategory(): EInquiryCategory {
        return this.category;
    }
    getPriority(): EInquiryCategory {
        return this.priority;
    }
    getRequesterInfo(): RequesterInfo {
        return this.requesterInfo;
    }
    getStatus(): EInquiryStatus {
        return this.status;
    }
    getAssignedToUserId(): UserId | undefined {
        return this.assignedToUserId;
    }
    getResolutionNotes(): string | undefined {
        return this.resolutionNotes;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
    getResolvedAt(): Date | undefined {
        return this.resolvedAt;
    }
}
