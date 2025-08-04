import { ValueObject } from '@shared/domain/value-objects';

export class CustomServices extends ValueObject {
    private static readonly MAX_SERVICES = 10;
    private static readonly MAX_SERVICE_LENGTH = 100;

    constructor(private readonly services: string[]) {
        super();
        if (services.length > CustomServices.MAX_SERVICES) {
            throw new Error(`Cannot have more than ${CustomServices.MAX_SERVICES} custom services`);
        }

        for (const service of services) {
            if (service.length > CustomServices.MAX_SERVICE_LENGTH) {
                throw new Error(`Service name cannot exceed ${CustomServices.MAX_SERVICE_LENGTH} characters`);
            }
        }

        // Remove duplicates and empty strings
        const cleanServices = [...new Set(services.filter((s) => s.trim().length > 0))];
        if (cleanServices.length !== services.length) {
            this.services = cleanServices;
        }
    }

    getServices(): string[] {
        return [...this.services];
    }

    hasService(service: string): boolean {
        return this.services.includes(service);
    }

    addService(service: string): CustomServices {
        if (this.hasService(service)) {
            return this;
        }

        if (this.services.length >= CustomServices.MAX_SERVICES) {
            throw new Error(`Cannot add more than ${CustomServices.MAX_SERVICES} custom services`);
        }

        return new CustomServices([...this.services, service]);
    }

    removeService(service: string): CustomServices {
        return new CustomServices(this.services.filter((s) => s !== service));
    }

    equals(other: ValueObject): boolean {
        if (!(other instanceof CustomServices)) return false;

        if (this.services.length !== other.services.length) return false;

        const sortedThis = [...this.services].sort();
        const sortedOther = [...other.services].sort();

        return sortedThis.every((service, index) => service === sortedOther[index]);
    }

    toString(): string {
        return this.services.join(', ');
    }
}
