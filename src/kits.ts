import { EnchantmentType, ItemStack, Player, world } from "@minecraft/server";
import config from "./config";
import type { Kit, KitEnchantment, KitItem } from "./Kits/types";

function canFitKit(player: Player, kit: Kit): boolean {
    const inventory = player.inventory;
    if (!inventory) return false;
    // Copy the current inventory state
    const simulated: (ItemStack | undefined)[] = [];
    for (let slot = 0; slot < inventory.size; slot++) {
        simulated.push(inventory.getItem(slot)?.clone());
    }

    for (const itemData of kit.items) {
        const item = assembleItem(itemData, kit.staticEnchants, itemData.displayName ?? kit.displayName);
        if (!item) continue;
        let amountLeft = item.amount;

        // First try existing compatible stacks
        for (let slot = 0; slot < simulated.length; slot++) {
            if (amountLeft <= 0) break;

            const existing = simulated[slot];
            if (!existing) continue;

            if (existing.typeId === item.typeId && item.isStackableWith(existing) && existing.amount < existing.maxAmount) {
                const available = existing.maxAmount - existing.amount;
                const adding = Math.min(available, amountLeft);

                existing.amount += adding;
                amountLeft -= adding;
            }
        }

        // Then use empty slots
        for (let slot = 0; slot < simulated.length; slot++) {
            if (amountLeft <= 0) break;

            if (simulated[slot]) continue;

            const stack = item.clone();
            stack.amount = Math.min(amountLeft, item.maxAmount);

            simulated[slot] = stack;
            amountLeft -= stack.amount;
        }

        // If anything still remains, kit cannot fit
        if (amountLeft > 0) {
            return false;
        }
    }

    return true;
}

world.afterEvents.itemUse.subscribe((data) => {
    const player = data.source as Player;
    const itemId = data.itemStack.typeId;

    const kits = Object.values(config.kits).flat();

    const kit = kits.find(kit => kit.itemName === itemId);

    if (!kit) return;
    if (!canFitKit(player, kit)) {
        player.onScreenDisplay.setActionBar(`§cYour inventory is full! Please clear some space before using this kit.`);
        return;
    }
    if (!takeOne(player, itemId)) return;

    giveKit(player, kit);
});

function giveKit(player: Player, kit: Kit) {
    for (const item of kit.items) {
        const finalItem = assembleItem(item, kit.staticEnchants, item.displayName ?? kit.displayName);

        if (finalItem) {
            const leftover = player.inventory.addItem(finalItem);
            if (leftover) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }
    }
    player.onScreenDisplay.setActionBar(`§aYou have received a kit!`);
    player.playSound("random.chestopen")
    player.playSound("note.pling");
}

export function assembleItem(itemData: KitItem, fallbackEnchants: KitEnchantment[] = [], displayName?: string): ItemStack {
    const item = new ItemStack(itemData.typeId, itemData.amount ?? 1);

    // Item Name (only if the item is not stackable)
    if (displayName && item.maxAmount === 1) {
        item.nameTag = `§r${displayName}`;
    }

    // Lore
    if (itemData.lore) {
        item.setLore(itemData.lore);
    }

    const enchantable = item.getComponent("minecraft:enchantable");
    if (!enchantable) return item;

    // Use item-specific enchants first, otherwise kit fallback enchants
    const enchants = itemData.enchantments ?? fallbackEnchants;

    for (const enchant of enchants) {
        const enchantment = {
            type: new EnchantmentType(enchant.id),
            level: enchant.level
        };

        if (!enchantable.canAddEnchantment(enchantment)) continue;

        enchantable.addEnchantment(enchantment);
    }

    return item;
}

export function clearItem(player: Player, itemId: string, decrement: number) {
    const inventory = player.getComponent('inventory').container
    const clearSlots: number[] = [];
    for (let i = 0; i < 36; i++) {
        let item = inventory.getItem(i)
        if (item?.typeId !== itemId) continue;
        if (decrement - item.amount > 0) {
            decrement -= item.amount;
            clearSlots.push(i);
            continue;
        }
        clearSlots.forEach(s => inventory.setItem(s));
        if (decrement - item.amount === 0) {
            inventory.setItem(i);
            return true;
        }
        item.amount -= decrement;
        inventory.setItem(i, item);
        return true;
    }
    return false;
};

// this function is too prevent duplication of items, when a player interacts with an item that is taken after
export function takeOne(player: Player, typeId: string): boolean {
    if (!player || !player.getComponent) return false;

    const inv = player.getComponent("minecraft:inventory")?.container;
    if (!inv) return false;

    const slot = player.selectedSlotIndex;
    if (slot < 0 || slot >= inv.size) return false;

    const item = inv.getItem(slot);
    if (!item || item.amount <= 0) return false;

    if (item.typeId !== typeId) return false;

    if (item.amount > 1) {
        item.amount--;
        inv.setItem(slot, item);
    } else {
        inv.setItem(slot, undefined);
    }

    return true;
}