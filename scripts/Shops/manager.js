import {} from "@minecraft/server";
import { ActionFormData, ModalFormData, uiManager } from "@minecraft/server-ui";
import config from "../config";
class ShopManager {
    // normal static shop
    static assembleShop(shop, player, callback) {
        const items = shop.items;
        const menu = new ActionFormData();
        menu.title(shop.displayName ?? "n/a");
        menu.body(shop.desc);
        for (const item of items) {
            menu.button(`${item.item.displayName ?? convertName(item.item.typeId)}\n§q[$${item.item.price} ${item.item.currency ?? 'Money'}]`, item.info.icon);
        }
        menu.show(player).then((result) => {
            uiManager.closeAllForms(player);
            if (result.canceled || result.selection === undefined) {
                if (callback) {
                    callback(player);
                    player.playSound(`item.book.page_turn`);
                }
                else {
                    player.playSound(`item.book.page_turn`);
                    player.sendMessage(`§r§cExited shop.`);
                }
                return;
            }
            const s = items[result.selection];
            const currency = s.item.currency ?? "Money";
            const price = s.item.price ?? 0;
            const playerCurrency = player.stats.get(currency);
            let itemInfo = `${s.info.desc ? `${s.info.desc}\n` : ``}§iPrice: §7${playerCurrency}/§a$${s.item.price} ${s.item.currency ?? 'Money'}`;
            // display the enchants
            if (isKit(s.item.typeId)) {
                const kits = Object.values(config.kits).flat();
                const kitEntry = kits.find(kit => kit.itemName === s.item.typeId);
                if (kitEntry) {
                    for (const item of kitEntry.items) {
                        // Item-specific enchants override static enchants
                        const enchants = item.enchantments ?? kitEntry.staticEnchants ?? [];
                        if (!item.enchantments || item.enchantments.length === 0)
                            continue;
                        itemInfo += `\n\n§sSpecific Enchantments: \n`;
                        itemInfo += `\n§f${convertName(item.typeId)}`;
                        for (const enchant of enchants) {
                            itemInfo += `\n§7${convertName(enchant.id)} ${numberToRoman(enchant.level)} `;
                        }
                    }
                    // normal static enchants
                    itemInfo += `\n\n§r§bEnchantments: \n`;
                    const staticEnch = kitEntry.staticEnchants ?? [];
                    for (const enchant of staticEnch) {
                        itemInfo += `\n§7${convertName(enchant.id)} ${numberToRoman(enchant.level)} `;
                    }
                }
            }
            const maxAffordable = price > 0 ? Math.floor(playerCurrency / price) : 64;
            const shopMax = 64;
            const maxPurchaseAmount = Math.min(maxAffordable, shopMax);
            // get the players current currency (or money) and set a number to the amount the player can actually buy.
            const menu2 = new ModalFormData();
            menu2.title(s.item.displayName ?? convertName(s.item.typeId));
            menu2.slider(`${itemInfo}

§r§7How many would you like to purchase ? `, 1, maxPurchaseAmount, { valueStep: 1 });
            menu2.submitButton(`§qPurchase §8${s.item.displayName ?? convertName(s.item.typeId)} `);
            menu2.show(player).then((response) => {
                uiManager.closeAllForms(player);
                if (response.canceled || !response.formValues) {
                    ShopManager.assembleShop(shop, player, callback);
                    return;
                }
                const slider = response.formValues[0];
                if (slider < 1 || slider > (64)) {
                    player.sendMessage(`§cPurchase cancelled.Invalid amount.`);
                    return;
                }
                const success = this.handlePurchase(player, s, slider, currency);
                if (!success)
                    return;
            });
        });
    }
    static handlePurchase(player, item, amount, currency) {
        const totalCost = item.item.price * amount;
        const playerBalance = player.stats.get(currency);
        if (playerBalance < totalCost) {
            player.sendMessage(`§cPurchase cancelled.Insufficient funds.`);
            return false;
        }
        player.stats.remove(currency, totalCost);
        this.giveItem(player, item, amount);
        player.sendMessage(`§aPurchase successful!`);
        return true;
    }
    static giveItem(player, item, amount) {
        player.give(item.item.typeId, amount);
    }
}
export function convertName(item) {
    if (!item.includes(':'))
        return item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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
export function numberToRoman(num) {
    if (num <= 0)
        return 0;
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1, }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}
function isKit(typeId) {
    if (typeId.endsWith('kit'))
        return true;
    return false;
}
export { ShopManager };
