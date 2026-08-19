export interface KitEnchantment {
    id: string;
    level: number;
}

export interface KitItem {
    typeId: string;
    displayName?: string;
    amount?: number;
    enchantments?: KitEnchantment[];
    lore?: string[];
}

export interface Kit {
    itemName: string;
    displayName: string;
    desc?: string;
    staticEnchants?: KitEnchantment[];
    items: KitItem[];
}
""