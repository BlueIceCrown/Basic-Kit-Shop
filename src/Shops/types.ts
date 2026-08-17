export interface ShopItem {
    item: {
        typeId: string;
        displayName?: string;
        amount?: number;
    };

    info: {
        desc: string | null;
        icon?: string;
    };
}

export interface ShopNavigation {
    button: {
        displayName: string;
        icon?: string;
    };

    shop: string;
}

export type ShopEntry = ShopItem;

export interface Shop {
    displayName: string;
    icon?: string;
    desc: string;
    items: ShopEntry[];
}
""