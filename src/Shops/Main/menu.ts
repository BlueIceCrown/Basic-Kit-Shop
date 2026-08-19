import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import config from "../../config";
import { ShopManager } from "../manager";
import type { Shop, TimedShop } from "../types";

export function mainShop(player: Player) {
    const shops = Object.entries(config.shops);

    const form = new ActionFormData();

    form.title("§l§dMain Shop");
    form.body("§iWelcome to the main shop! Please select a category below to view the items available for purchase.");
    for (const [, category] of shops) {
        form.button(`§5${category.displayName}\n§8Click to View`, category.icon);
    }
    form.show(player).then((response) => {
        if (response.canceled || response.selection === undefined) return;

        const [shopId, selectedCategory] = shops[response.selection];

        if (!selectedCategory) return;

        // Timed shop
        if ("expiryTime" in selectedCategory) {
            ShopManager.assembleTimedShop(shopId, selectedCategory as TimedShop, player, mainShop);
            return;
        }
        ShopManager.assembleShop(selectedCategory as Shop, player, mainShop);
    });
}