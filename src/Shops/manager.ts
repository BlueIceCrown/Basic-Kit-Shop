import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import type { Shop, ShopEntry } from "./types";


class ShopManager {
    static assembleShop(shop: Shop, player: Player): void {
        const items: ShopEntry[] = shop.items;

        const menu = new ActionFormData()
        menu.title(shop.displayName ?? "n/a")
        menu.body(shop.desc);

        for (const item of items) {
            menu.button(item.item.displayName ?? item.item.typeId, item.info.icon);
        }
    }
}