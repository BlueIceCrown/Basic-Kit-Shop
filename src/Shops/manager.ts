import { type Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, uiManager } from "@minecraft/server-ui";
import config from "../config";
import { addScore, getScore } from "../scoreboardfunctions";
import type { Shop, ShopEntry } from "./types";

export function convertName(item) {
    if (!item.includes(':')) return item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    let newItem = item.split(':')[1];
    // Capitalize the first letter of each word
    newItem = newItem.replace(/\b\w/g, char => char.toUpperCase());
    // Replace ALL underscores with spaces
    newItem = newItem.replace(/_/g, ' ');

    // Capitalize the first letter of each word
    newItem = newItem.replace(/\b\w/g, char => char.toUpperCase());

    // Optional custom renames
    switch (newItem) {
        case "Ancient Debris":
            newItem = "Debris";
            break;
    }

    return newItem;
}

class ShopManager {
    // normal static shop
    static assembleShop(shop: Shop, player: Player, callback: any): void {
        const items: ShopEntry[] = shop.items;

        const menu = new ActionFormData()
        menu.title(shop.displayName ?? "n/a")
        menu.body(shop.desc);

        for (const item of items) {
            menu.button(item.item.displayName ?? item.item.typeId, item.info.icon);
        }
        menu.show(player).then((result) => {
            uiManager.closeAllForms(player);
            if (result.canceled || result.selection === undefined) {
                if (callback) {
                    callback(player);
                    player.playSound(`item.book.page_turn`);
                } else {
                    player.playSound(`item.book.page_turn`);
                    player.sendMessage(`§r§cExited shop.`);
                }
                return;
            }
            const s = items[result.selection];
            let itemInfo = `${s.info.desc}`
            // display the callback enchants if the item is a kit (UNLESS THERE IS CUSTOM ONES FOR A CERTAIN ITEM)
            if (isKit(s.item.typeId)) {
                const kits = Object.values(config.kits).flat();
                const kitEntry = kits.find(kit => kit.itemName === s.item.typeId);
                if (kitEntry) {
                    itemInfo += `\n\n§r§eEnchantments:`;

                    for (const item of kitEntry.items) {
                        // Item-specific enchants override static enchants
                        const enchants = item.enchantments ?? kitEntry.staticEnchants ?? []
                        if (enchants.length === 0) continue;

                        itemInfo += `\n§f${convertName(item.typeId)}`;

                        for (const enchant of enchants) {
                            itemInfo += `\n  §7${enchant.id} ${enchant.level}`;
                        }
                    }
                }
            }
            const menu2 = new ModalFormData();
            menu2.title(s.item.displayName ?? s.item.typeId);
            menu2.slider(`${itemInfo}

§r§7How many would you like to purchase?`, 1, s.maxAmount ? s.maxAmount : 64, { valueStep: 1 });
            menu2.submitButton('§aPurchase');
            menu2.show(player).then((response) => {
                uiManager.closeAllForms(player);
                if (response.canceled || !response.formValues) {
                    ShopManager.assembleShop(shop, player, callback)
                    return;
                }

                const slider = response.formValues[0] as number;
                if (slider < 1 || slider > (s.maxAmount ? s.maxAmount : 64)) {
                    player.sendMessage(`§cPurchase cancelled. Invalid amount.`);
                    return;
                }
                const success = this.handlePurchase(player, s, slider, currency);
                if (!success) return;
            });
        })
    }
    static handlePurchase(player: Player, item: ShopEntry, amount: number, currency: string): boolean {
        const totalCost = item.item.price * amount;
        const playerBalance = getScore(player, currency);
        if (playerBalance < totalCost) {
            player.sendMessage(`§cPurchase cancelled. Insufficient funds.`);
            return false;
        }
        addScore(player, currency, -totalCost);
        this.giveItem(player, item, amount);
        player.sendMessage(`§aPurchase successful!`);
        return true;
    }
    static giveItem(player: Player, item: ShopEntry, amount: number): void {
        player.give(item.item.typeId, amount);
    }
}

function isKit(typeId: string): boolean {
    if (typeId.endsWith('kit')) return true;
    return false
}

export { ShopManager };

