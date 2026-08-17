import { Entity } from "@minecraft/server";

// Manages numeric dynamic properties on an entity
export class DynamicPropertyManager {
    constructor(private target: Entity) { }

    get(propertyId: string, useZero = true): number {
        const value = this.target.getDynamicProperty(propertyId);

        if (typeof value !== "number") {
            return useZero ? 0 : NaN;
        }

        return value;
    }

    set(propertyId: string, value: number): void {
        this.target.setDynamicProperty(propertyId, value);
    }

    add(propertyId: string, amount: number): number {
        const newValue = this.get(propertyId) + amount;

        this.set(propertyId, newValue);

        return newValue;
    }

    remove(propertyId: string, amount: number): number {
        return this.add(propertyId, -amount);
    }

    has(propertyId: string): boolean {
        return typeof this.target.getDynamicProperty(propertyId) === "number";
    }

    delete(propertyId: string): void {
        this.target.setDynamicProperty(propertyId, undefined);
    }
}