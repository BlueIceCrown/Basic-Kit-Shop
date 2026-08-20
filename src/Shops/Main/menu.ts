import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import config from "../../config";
import { kitsShop } from "../Kits/menu";
import { ShopManager } from "../manager";

export function mainShop(player: Player) {
    const formButtons = []
    const form = new ActionFormData();
    form.title("§l§dMain Shop");
    form.body("§iWelcome to the main shop! Please select a category below to view the items available for purchase.");
    form.button(`§5Items\n§8Click to View`, "textures/items/diamond");
    formButtons.push('items')
    form.button(`§5Kits\n§8Click to View`, "textures/items/iron_chestplate");
    formButtons.push('kits')
    form.button(`§5Limited Time\n§8Click to View`, "textures/ui/icon_blackfriday");
    formButtons.push('limitedTime')
    form.show(player).then((response) => {
        if (response.canceled || response.selection === undefined) return;
        switch (formButtons[response.selection]) {
            case 'items':
                ShopManager.assembleShop(config.shops.itemShop, player, mainShop);
                break;
            case 'kits':
                kitsShop(player);
                break;
            case 'limitedTime':
                const shopId = config.shops.limitedtimeShop.displayName
                ShopManager.assembleTimedShop(shopId, config.shops.limitedtimeShop, player, mainShop);
                break;
        }
    });
}