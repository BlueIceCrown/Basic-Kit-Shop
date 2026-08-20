import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import config from "../../config";
import { mainShop } from "../Main/menu";
import { ShopManager } from "../manager";

export function kitsShop(player: Player) {
    const form = new ActionFormData();
    form.title("§l§dKits Shop");
    form.body("§iWelcome to the kits shop! Please select a category below to view the items available for purchase.");
    const kitShops = Object.entries(config.shops).filter(([key]) => key.endsWith("KitsShop"));
    for (const [, shop] of kitShops) {
        form.button(`§5${shop.displayName}\n§8Click to View`, shop.icon ?? "textures/items/iron_chestplate");
    }
    form.show(player).then((response) => {
        if (response.canceled || response.selection === undefined) {
            mainShop(player);
            return;
        }
        const selected = kitShops[response.selection];
        if (!selected) return;
        const [, selectedShop] = selected;
        ShopManager.assembleShop(selectedShop, player, kitsShop);
    });
}