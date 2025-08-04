import { EventEmitter2 } from '@nestjs/event-emitter';
import { Entity } from '@shared/domain/entities';
import { IDomainEvent } from '@shared/domain/types';

export abstract class AggregateRoot<T> extends Entity<T> {
    private domainEvents: IDomainEvent[] = [];

    protected addDomainEvent(event: IDomainEvent): void {
        this.domainEvents.push(event);
    }

    public getDomainEvents(): IDomainEvent[] {
        return [...this.domainEvents];
    }

    protected clearDomainEvents(): void {
        this.domainEvents = [];
    }

    protected publishEvents(eventEmitter: EventEmitter2): void {
        this.domainEvents.forEach((event) => {
            eventEmitter.emit(event.eventType, event);
        });
        this.clearDomainEvents();
    }
}
