import type { TimerObject } from "../Timer";

export interface ShopItem {
    item: {
        typeId: string;
        displayName?: string;
        amount?: number;
        price?: number;
        currency?: string;
    };

    info: {
        desc?: string;
        icon?: string;
    };
}

export interface ShopExpiryTime {
    days?: number;
    hours?: number;
    mins?: number;
    seconds?: number;
}

export interface TimedShopState {
    timer: TimerObject;
    items: ActiveTimedShopItem[];
}

export interface TimedShop {
    displayName: string;
    desc: string;
    icon?: string;

    // Number of random items selected each reroll
    itemCount: number;

    // How long until the shop rerolls
    expiryTime: {
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    };

    items: TimedShopItem[];
}

export interface TimedShopItem {
    item: {
        typeId: string;
        displayName?: string;
        amount?: number;
        price: number;
        currency?: string;
        stock: {
            min: number;
            max: number;
        };
    };
    info: {
        desc?: string | null;
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

export interface TimedShopItem {
    item: {
        typeId: string;
        displayName?: string;
        amount?: number;
        price: number;
        currency?: string;

        stock: {
            min: number;
            max: number;
        };
    };

    info: {
        desc?: string;
        icon?: string;
    };
}

export interface ActiveTimedShopItem extends TimedShopItem {
    currentStock: number;
}
""