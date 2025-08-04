import { AggregateRoot } from '@shared/domain/aggregates';
import { CustomCategoryAdded, ServiceCategoryCreated, ServiceCategoryUpdated } from '../../events';
import { CategoryDescription, CategoryIcon, CategoryName, ServiceCategoryId } from '../../value-objects';

export class ServiceCategory extends AggregateRoot<ServiceCategoryId> {
    private constructor(
        id: ServiceCategoryId,
        private name: CategoryName,
        private description: CategoryDescription,
        private icon: CategoryIcon,
        private readonly isStandard: boolean = true,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static createStandard(name: CategoryName, description: CategoryDescription, icon: CategoryIcon): ServiceCategory {
        const categoryId = ServiceCategoryId.generate();

        const category = new ServiceCategory(categoryId, name, description, icon, true);

        const categoryCreatedEvent: ServiceCategoryCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServiceCategoryCreated',
            occurredOn: new Date(),
            categoryId: categoryId.getValue(),
            categoryName: name.getValue(),
        };

        category.addDomainEvent(categoryCreatedEvent);

        return category;
    }

    static createCustom(name: CategoryName, description: CategoryDescription, icon: CategoryIcon): ServiceCategory {
        const categoryId = ServiceCategoryId.generate();

        const category = new ServiceCategory(categoryId, name, description, icon, false);

        const customCategoryAddedEvent: CustomCategoryAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'CustomCategoryAdded',
            occurredOn: new Date(),
            categoryId: categoryId.getValue(),
            categoryName: name.getValue(),
        };

        category.addDomainEvent(customCategoryAddedEvent);

        return category;
    }

    updateName(name: CategoryName): void {
        if (this.isStandard) {
            throw new Error('Cannot update standard category name');
        }

        this.name = name;
        this.updatedAt = new Date();

        const categoryUpdatedEvent: ServiceCategoryUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServiceCategoryUpdated',
            occurredOn: new Date(),
            categoryId: this.getId().getValue(),
            updatedFields: ['name'],
        };

        this.addDomainEvent(categoryUpdatedEvent);
    }

    updateDescription(description: CategoryDescription): void {
        this.description = description;
        this.updatedAt = new Date();

        const categoryUpdatedEvent: ServiceCategoryUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServiceCategoryUpdated',
            occurredOn: new Date(),
            categoryId: this.getId().getValue(),
            updatedFields: ['description'],
        };

        this.addDomainEvent(categoryUpdatedEvent);
    }

    updateIcon(icon: CategoryIcon): void {
        this.icon = icon;
        this.updatedAt = new Date();

        const categoryUpdatedEvent: ServiceCategoryUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServiceCategoryUpdated',
            occurredOn: new Date(),
            categoryId: this.getId().getValue(),
            updatedFields: ['icon'],
        };

        this.addDomainEvent(categoryUpdatedEvent);
    }

    // Getters
    getName(): CategoryName {
        return this.name;
    }
    getDescription(): CategoryDescription {
        return this.description;
    }
    getIcon(): CategoryIcon {
        return this.icon;
    }
    isStandardCategory(): boolean {
        return this.isStandard;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
