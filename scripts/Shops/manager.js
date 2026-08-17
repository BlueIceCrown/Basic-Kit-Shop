import { ActionFormData } from "@minecraft/server-ui";
class ShopManager {
    static assembleShop(shop, player) {
        const items = shop.items;
        const menu = new ActionFormData();
        menu.title(shop.displayName ?? "n/a");
        menu.body(shop.desc);
        for (const item of items) {
            menu.button(item.item.displayName ?? item.item.typeId, item.info.icon);
        }
    }
}
