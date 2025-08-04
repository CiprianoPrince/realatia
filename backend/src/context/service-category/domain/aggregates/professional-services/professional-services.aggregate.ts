import { AggregateRoot } from '@shared/domain/aggregates';
import { BusinessProfileId, UserId } from '@shared/domain/value-objects';
import { ServiceCategory } from '..';
import { CustomServiceAdded, ServicesUpdated } from '../../events';
import { EStandardServiceCategory } from '../../types';
import { CategoryName, CustomServices, SelectedCategories, ServiceCategoryId } from '../../value-objects';

export class ProfessionalServices extends AggregateRoot<string> {
    private constructor(
        id: string,
        private readonly userId: UserId,
        private readonly businessProfileId: BusinessProfileId,
        private selectedCategories: SelectedCategories,
        private customServices: CustomServices,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static create(
        userId: UserId,
        businessProfileId: BusinessProfileId,
        selectedCategories: SelectedCategories = new SelectedCategories([]),
        customServices: CustomServices = new CustomServices([])
    ): ProfessionalServices {
        const id = `prof_services_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        const professionalServices = new ProfessionalServices(
            id,
            userId,
            businessProfileId,
            selectedCategories,
            customServices
        );

        const servicesUpdatedEvent: ServicesUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServicesUpdated',
            occurredOn: new Date(),
            userId: userId.getValue(),
            businessProfileId: businessProfileId.getValue(),
            selectedCategories: selectedCategories.getCategories(),
            customServices: customServices.getServices(),
        };

        professionalServices.addDomainEvent(servicesUpdatedEvent);

        return professionalServices;
    }

    updateSelectedCategories(selectedCategories: SelectedCategories): void {
        this.selectedCategories = selectedCategories;
        this.updatedAt = new Date();

        const servicesUpdatedEvent: ServicesUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'ServicesUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.businessProfileId.getValue(),
            selectedCategories: selectedCategories.getCategories(),
            customServices: this.customServices.getServices(),
        };

        this.addDomainEvent(servicesUpdatedEvent);
    }

    addCustomService(serviceName: string): void {
        this.customServices = this.customServices.addService(serviceName);
        this.updatedAt = new Date();

        const customServiceAddedEvent: CustomServiceAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'CustomServiceAdded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            businessProfileId: this.businessProfileId.getValue(),
            serviceName,
        };

        this.addDomainEvent(customServiceAddedEvent);
    }

    removeCustomService(serviceName: string): void {
        this.customServices = this.customServices.removeService(serviceName);
        this.updatedAt = new Date();
    }

    addStandardCategory(category: EStandardServiceCategory): void {
        this.selectedCategories = this.selectedCategories.addCategory(category);
        this.updatedAt = new Date();
    }

    removeStandardCategory(category: EStandardServiceCategory): void {
        this.selectedCategories = this.selectedCategories.removeCategory(category);
        this.updatedAt = new Date();
    }

    getAllServices(): string[] {
        const standardServices = this.selectedCategories.getCategories().map((c) => c.toString());
        const customServicesList = this.customServices.getServices();
        return [...standardServices, ...customServicesList];
    }

    hasService(serviceName: string): boolean {
        return this.getAllServices().includes(serviceName);
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getBusinessProfileId(): BusinessProfileId {
        return this.businessProfileId;
    }
    getSelectedCategories(): SelectedCategories {
        return this.selectedCategories;
    }
    getCustomServices(): CustomServices {
        return this.customServices;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}

// Repository Interfaces - service-category/domain/repositories/
export interface ServiceCategoryRepository {
    save(category: ServiceCategory): Promise<void>;
    findById(id: ServiceCategoryId): Promise<ServiceCategory | null>;
    findByName(name: CategoryName): Promise<ServiceCategory | null>;
    findAllStandard(): Promise<ServiceCategory[]>;
    findAllCustom(): Promise<ServiceCategory[]>;
    delete(id: ServiceCategoryId): Promise<void>;
}

export interface ProfessionalServicesRepository {
    save(services: ProfessionalServices): Promise<void>;
    findById(id: string): Promise<ProfessionalServices | null>;
    findByUserId(userId: UserId): Promise<ProfessionalServices | null>;
    findByBusinessProfileId(businessProfileId: BusinessProfileId): Promise<ProfessionalServices | null>;
    findByCategory(category: EStandardServiceCategory): Promise<ProfessionalServices[]>;
    delete(id: string): Promise<void>;
}
