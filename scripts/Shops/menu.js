import { ActionFormData } from "@minecraft/server-ui";
import config from "../config";
import { ShopManager } from "./manager";
export function mainShop(player) {
    const form = new ActionFormData();
    form.title("Main Shop");
    form.body("Welcome to the main shop! Please select a category below to view the items available for purchase.");
    for (const category of Object.values(config.shops)) {
        form.button(category.displayName, category.icon);
    }
    form.show(player).then((response) => {
        if (!response)
            return;
        const selectedCategory = Object.values(config.shops)[response.selection];
        if (!selectedCategory)
            return;
        ShopManager.assembleShop(selectedCategory, player, mainShop);
    });
}
