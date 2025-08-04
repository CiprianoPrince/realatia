export abstract class Entity<T> {
    constructor(protected readonly id: T) {}

    getId(): T {
        return this.id;
    }

    equals(other: Entity<T>): boolean {
        return this.id === other.getId();
    }
}
