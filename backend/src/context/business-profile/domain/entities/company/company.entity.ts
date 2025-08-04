import { Entity } from '@shared/domain/entities';

export class Company extends Entity<string> {
    constructor(
        id: string,
        private name: string,
        private description: string,
        private foundedYear: number,
        private website?: string,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
        if (!name || !description) {
            throw new Error('Company name and description are required');
        }
    }

    static create(name: string, description: string, foundedYear: number, website?: string): Company {
        const id = `company_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new Company(id, name, description, foundedYear, website);
    }

    getName(): string {
        return this.name;
    }
    getDescription(): string {
        return this.description;
    }
    getFoundedYear(): number {
        return this.foundedYear;
    }
    getWebsite(): string | undefined {
        return this.website;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    updateName(name: string): void {
        if (!name) throw new Error('Company name cannot be empty');
        this.name = name;
        this.updatedAt = new Date();
    }

    updateDescription(description: string): void {
        if (!description) throw new Error('Company description cannot be empty');
        this.description = description;
        this.updatedAt = new Date();
    }

    updateWebsite(website: string): void {
        this.website = website;
        this.updatedAt = new Date();
    }
}
