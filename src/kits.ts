import { EnchantmentType, ItemStack, Player, world } from "@minecraft/server";
import config from "./config";
import type { Kit, KitEnchantment, KitItem } from "./Kits/types";


world.afterEvents.itemUse.subscribe((data) => {
    const player = data.source as Player;
    const itemId = data.itemStack.typeId;

    const kits = Object.values(config.kits).flat();

    const kit = kits.find(kit => kit.itemName === itemId);

    if (!kit) return;
    if (!takeOne(player, itemId)) return;

    giveKit(player, kit);
});

function giveKit(player: Player, kit: Kit) {
    const inventory = player.getComponent("inventory").container;

    if (inventory.emptySlotsCount < kit.items.length) {
        player.sendMessage("You do not have enough space in your inventory to receive this kit.");
        player.playSound("note.bass");
        return;
    }

    for (const item of kit.items) {
        const finalItem = assembleItem(item, kit.staticEnchants, item.displayName ?? kit.displayName);

        if (finalItem) {
            const leftover = inventory.addItem(finalItem);
            if (leftover) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }
    }
    player.onScreenDisplay.setActionBar(`§aYou have received the ${kit.displayName} kit!`);
    player.playSound("random.chestopen")
    player.playSound("note.pling");
}

export function assembleItem(itemData: KitItem, fallbackEnchants: KitEnchantment[] = [], displayName?: string): ItemStack {
    const item = new ItemStack(itemData.typeId, itemData.amount ?? 1);

    // Item Name (only if the item is not stackable)
    if (displayName && !item.isStackable) {
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