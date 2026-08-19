import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import config from "../config";
import { ShopManager } from "./manager";
import type { Shop } from "./types";

export function mainShop(player: Player) {
    const form = new ActionFormData()
    form.title("§l§dMain Shop")
    form.body("§iWelcome to the main shop! Please select a category below to view the items available for purchase.")
    for (const category of Object.values(config.shops) as Shop[]) {
        form.button(`§5${category.displayName}\n§8Click to View`, category.icon)
    }
    form.show(player).then((response) => {
        if (!response) return;
        const selectedCategory = Object.values(config.shops)[response.selection] as Shop;
        if (!selectedCategory) return;
        ShopManager.assembleShop(selectedCategory, player, mainShop)
    });
}