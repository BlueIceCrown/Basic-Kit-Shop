import { Entity } from "@minecraft/server";
// Manages numeric dynamic properties on an entity
export class DynamicPropertyManager {
    target;
    constructor(target) {
        this.target = target;
    }
    get(propertyId, useZero = true) {
        const value = this.target.getDynamicProperty(propertyId);
        if (typeof value !== "number") {
            return useZero ? 0 : NaN;
        }
        return value;
    }
    set(propertyId, value) {
        this.target.setDynamicProperty(propertyId, value);
    }
    add(propertyId, amount) {
        const newValue = this.get(propertyId) + amount;
        this.set(propertyId, newValue);
        return newValue;
    }
    remove(propertyId, amount) {
        return this.add(propertyId, -amount);
    }
    has(propertyId) {
        return typeof this.target.getDynamicProperty(propertyId) === "number";
    }
    delete(propertyId) {
        this.target.setDynamicProperty(propertyId, undefined);
    }
}
