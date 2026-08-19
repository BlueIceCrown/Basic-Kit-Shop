import { Container, ItemStack, Player } from "@minecraft/server";
import { DynamicPropertyManager } from "../Dynamic/manager";

declare module "@minecraft/server" {
    interface Container {
        isFull(): boolean;
    }
    interface Player {
        give(typeOrItem: string | ItemStack, quantity?: number, lore?: string[], itemLock?: boolean, space?: Container, preferredSlot?: number, keepOnDeath?: boolean): void;
        addItemToInv(item: ItemStack, space?: Container, preferredSlot?: number): void;
        readonly inventory: Container | undefined;
        readonly stats: DynamicPropertyManager;
    }
}

Object.defineProperty(Player.prototype, "inventory", {
    get(this: Player): Container | undefined {
        return this.getComponent("minecraft:inventory").container!;
    }
});

Container.prototype.isFull = function (): boolean {
    return this.emptySlotsCount === 0;
};

Player.prototype.give = function (typeOrItem: string | ItemStack, quantity: number = 1, lore: string[] | undefined = undefined, itemLock: boolean = false, space: Container | undefined = undefined, preferredSlot: number | undefined = undefined, keepOnDeath: boolean = false): void {
    const inventory = space ?? this.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;

    let template: ItemStack;

    if (typeof typeOrItem === "string") {
        template = new ItemStack(typeOrItem, 1);
    } else {
        template = typeOrItem.clone();
        quantity = quantity ?? template.amount;
        template.amount = 1;
    }

    if (!template || quantity <= 0) return;

    if (lore) template.setLore(lore);
    if (itemLock) template.lockMode = "inventory" as any;
    if (keepOnDeath) template.keepOnDeath = true;

    if (preferredSlot === undefined) {
        preferredSlot = inventory.firstEmptySlot();
    }

    let amountLeft = quantity;

    if (template.maxAmount === 1) {
        while (amountLeft > 0) {
            const newItem = template.clone();
            newItem.amount = 1;

            this.addItemToInv(newItem, inventory, preferredSlot);

            amountLeft--;
            preferredSlot = inventory.firstEmptySlot();
        }

        return;
    }

    for (let slot = 0; slot < inventory.size; slot++) {
        if (amountLeft <= 0) break;

        const existing = inventory.getItem(slot);
        if (!existing) continue;

        if (existing.typeId === template.typeId && template.isStackableWith(existing) && existing.amount < existing.maxAmount) {
            const canAdd = existing.maxAmount - existing.amount;
            const adding = Math.min(canAdd, amountLeft);

            existing.amount += adding;
            amountLeft -= adding;

            inventory.setItem(slot, existing);
        }
    }

    while (amountLeft > 0) {
        const stackAmount = Math.min(amountLeft, template.maxAmount);

        const newItem = template.clone();
        newItem.amount = stackAmount;

        this.addItemToInv(newItem, inventory, preferredSlot);

        amountLeft -= stackAmount;
        preferredSlot = inventory.firstEmptySlot();
    }
};

Player.prototype.addItemToInv = function (item: ItemStack, space: Container | undefined = undefined, preferredSlot: number | undefined = undefined): void {
    const inventory = space ?? this.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;

    if (preferredSlot === undefined) {
        preferredSlot = inventory.firstEmptySlot();
    }

    if (preferredSlot !== undefined && preferredSlot !== -1 && inventory.getItem(preferredSlot) === undefined) {
        inventory.setItem(preferredSlot, item);
        return;
    }
    // this is just part of my give prototype thats been used for cosier
    if (inventory.emptySlotsCount === 0) {
        this.dimension.spawnItem(item, this.location);
    } else {
        inventory.addItem(item);
    }
};

Object.defineProperty(Player.prototype, "stats", {
    get(this: Player) {
        return new DynamicPropertyManager(this);
    }
});