import type { Player } from "@minecraft/server";

export interface NPC {
    tag: string;
    typeId?: string | 'minecraft:npc';
    function: (player: Player) => void;
}

export interface KitEnchantment {
    id: string;
    level: number;
}

export interface KitItem {
    typeId: string;
    amount?: number;
    lore?: string[];
    enchantments?: KitEnchantment[];
}

export interface Kit {
    itemName: string;
    displayName: string;
    desc?: string;
    staticEnchants?: KitEnchantment[];
    items: KitItem[];
}

export type KitConfig = {
    leatherKits: Kit[];
    chainmailKits: Kit[];
    ironKits: Kit[];
    diamondKits: Kit[];
};