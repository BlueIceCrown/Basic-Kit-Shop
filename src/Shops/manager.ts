import { Container, ItemStack, world, type Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, uiManager } from "@minecraft/server-ui";
import config from "../config";
import Timer, { type TimerObject } from "../Timer";
import type { ActiveTimedShopItem, Shop, ShopEntry, ShopExpiryTime, ShopItem, TimedShop, TimedShopState } from "./types";

class ShopManager {
    private static timedShopStock: ActiveTimedShopItem[] = [];
    // normal static shop
    static assembleShop(shop: Shop, player: Player, callback?: any): void {
        const items: ShopEntry[] = shop.items;

        const menu = new ActionFormData()
        menu.title(`§l§d${shop.displayName ?? 'n/a'}`)
        menu.body(`§i${shop.desc}`);

        for (const item of items) {
            menu.button(`§5${item.item.displayName ?? convertName(item.item.typeId)}${item.item.amount > 1 ? ` §d[x${item.item.amount}]` : ``}\n§q[$${item.item.price ?? 1} ${item.item.currency ?? 'Money'}]`, item.info.icon);
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
            const selected = items[result.selection]
            this.showPurchaseForm(player, selected, null, null, callback);
        })
    }
    //universal purchase form for all shops, timed or not.
    static showPurchaseForm(player: Player, item: ShopItem, maxPurchases?: number, name?: string, callback?: any): void {
        const currency = item.item.currency ?? "Money";
        const price = item.item.price ?? 1;
        const playerCurrency = player.stats.get(currency);
        const amountPerPurchase = item.item.amount ?? 1;
        const template = new ItemStack(item.item.typeId, 1);
        let itemInfo = `${item.info.desc ? `${item.info.desc}\n` : ""}§iPrice: §7${playerCurrency}/§a$${price} ${currency}`;

        // Kit enchantment information
        if (isKit(item.item.typeId)) {
            const kits = Object.values(config.kits).flat();
            const kitEntry = kits.find(kit => kit.itemName === item.item.typeId);
            if (kitEntry) {
                for (const kitItem of kitEntry.items) {
                    if (!kitItem.enchantments || kitItem.enchantments.length === 0) continue;

                    itemInfo += `\n\n§sSpecific Enchantments:`;
                    itemInfo += `\n§f${convertName(kitItem.typeId)}`;

                    for (const enchant of kitItem.enchantments) {
                        itemInfo += `\n§7${convertName(enchant.id)} ${numberToRoman(enchant.level)}`;
                    }
                }

                const staticEnchants = kitEntry.staticEnchants ?? [];

                if (staticEnchants.length > 0) {
                    itemInfo += `\n\n§r§bEnchantments:`;

                    for (const enchant of staticEnchants) {
                        itemInfo += `\n§7${convertName(enchant.id)} ${numberToRoman(enchant.level)}`;
                    }
                }
            }
        }
        // Figure out how many purchases can fit
        const itemCapacity = getItemCapacity(player.inventory, template);
        const maxByInventory = Math.floor(itemCapacity / amountPerPurchase);
        const maxAffordable = price > 0 ? Math.floor(playerCurrency / price) : 64;
        const maxPurchaseAmount = Math.min(maxAffordable, maxByInventory, maxPurchases ?? 64);
        const displayName = item.item.displayName ?? convertName(item.item.typeId);
        // Stackable item (slider)
        if (template.maxAmount > 1) {
            const form = new ModalFormData();
            form.title(`§l§d${displayName}`);
            form.slider(`§i${itemInfo}

§r§7Amount to purchase`, 1, maxPurchaseAmount, { valueStep: 1 });
            form.submitButton(`§qPurchase §8${displayName}`);
            form.show(player).then(response => {
                uiManager.closeAllForms(player);

                if (response.canceled || !response.formValues) {
                    if (callback) callback(player)
                    return;
                }
                const amount = response.formValues[0] as number;
                // believe it or not, there are clients out there that can manipulate packets sent to forms. 
                // players on cosier would use said clients to set the slider to a negative amount to actually duplicate money.
                if (amount < 1) {
                    player.sendMessage("§cPurchase cancelled. Invalid amount.");
                    return;
                }

                this.handlePurchase(player, item, amount, currency, name);
            });
            return;
        }
        // non-stackable item 
        const form = new ActionFormData();
        form.title(`§l§d${displayName}`);
        form.body(`§i${itemInfo}

§r§7Would you like to purchase this item?`);
        form.button(`§qBuy ${displayName}\n§8$${price} ${currency}`);
        form.show(player).then(response => {
            uiManager.closeAllForms(player);
            if (response.canceled || !response.selection) {
                if (callback) callback(player)
                return;
            }
            this.handlePurchase(player, item, 1, currency, name);
        });
    }
    static handlePurchase(player: Player, item: ShopEntry, amount: number, currency = 'Money', name?: string): boolean {
        const totalCost = item.item.price * amount;
        const itemAmount = item.item.amount ?? 1;

        const playerBalance = player.stats.get(currency);

        if (playerBalance < totalCost) {
            player.sendMessage("§cPurchase cancelled. Insufficient funds.");
            return false;
        }
        const currentCapacity = getItemCapacity(player.inventory, new ItemStack(item.item.typeId, 1));
        if (currentCapacity < itemAmount * amount) {
            player.sendMessage("§cPurchase cancelled. Your inventory is full.");
            return false;
        }
        // Timed shop: re-check CURRENT stock
        if (name) {
            const state = this.getTimedShopState(name);
            if (!state) {
                player.sendMessage("§cPurchase cancelled. Timed shop data could not be found.");
                return false;
            }
            const storedItem = state.items.find(entry => entry.item.typeId === item.item.typeId);
            if (!storedItem) {
                player.sendMessage("§cPurchase cancelled. This item is no longer available.");
                return false;
            }
            // this is incase a player buys something while another is still on the menu, (tldr; to prevent people from buying more than the stock has)
            if (storedItem.currentStock < amount) {
                player.sendMessage(`§cPurchase cancelled. Only ${storedItem.currentStock} left in stock.`);
                return false;
            }
            storedItem.currentStock -= amount;
            this.saveTimedShopState(state, name);
        }
        player.stats.remove(currency, totalCost);
        this.giveItem(player, item, itemAmount * amount);
        player.sendMessage(`§aPurchase successful!
§c-${totalCost} ${currency}`);
        player.playSound("random.levelup");
        return true;
    }
    // timed shop
    static assembleTimedShop(name: string, shop: TimedShop, player: Player, callback?: any): void {
        let state = this.getTimedShopState(name);
        // no saved shop yet
        if (!state) {
            state = this.rerollTimedShop(shop, name);
        }
        // saved shop expired
        else if (Timer.hasExpired(state.timer)) {
            state = this.rerollTimedShop(shop, name);
        }
        const items = state.items;
        const remaining = Timer.remaining(state.timer);
        const form = new ActionFormData();
        form.title(`§l§d${shop.displayName ?? 'n/a'}`);
        form.body(`${shop.desc}\n\n§iThis shop will reroll in §d${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`);

        for (const entry of items) {
            form.button(`§5${entry.item.displayName ?? convertName(entry.item.typeId)}${entry.item.amount > 1 ? ` §d[x${entry.item.amount}]` : ``} ${entry.currentStock > 0 ? `§8[Stock: §4${entry.currentStock}§8]` : `§4**Sold Out**`}
§q$${entry.item.price} ${entry.item.currency ?? "Money"}`, entry.currentStock > 0 ? entry.info.icon : 'textures/blocks/barrier');
        }

        form.show(player).then((response) => {
            if (response.canceled || response.selection === undefined) {
                if (callback) return callback(player);
            }
            const selected = items[response.selection];
            if (!selected) return;
            if (selected.currentStock <= 0) {
                player.sendMessage(`§c${selected.item.displayName ?? convertName(selected.item.typeId)} is currently sold out.`)
                player.playSound('random.anvil_land')
                return;
            }
            this.showPurchaseForm(player, selected, selected.currentStock, name, callback);
        });
    }
    static removeTimedStock(itemIndex: number, amount: number, name: string): boolean {
        const state = this.getTimedShopState(name);
        if (!state) return false;
        const item = state.items[itemIndex];
        if (!item) return false;
        if (item.currentStock < amount) {
            return false;
        }
        item.currentStock -= amount;
        this.saveTimedShopState(state, name);
        return true;
    }
    // give the player the item they purchased
    static giveItem(player: Player, item: ShopEntry, amount: number): void {
        player.give(item.item.typeId, amount);
    }
    static rerollTimedShop(shop: TimedShop, name: string): TimedShopState {
        const availableItems = [...shop.items];

        const itemCount = Math.min(
            shop.itemCount ?? availableItems.length,
            availableItems.length
        );

        const selectedItems: ActiveTimedShopItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const randomIndex = Math.floor(
                Math.random() * availableItems.length
            );

            const [selected] = availableItems.splice(randomIndex, 1);

            const minStock = selected.item.stock?.min ?? 1;
            const maxStock = selected.item.stock?.max ?? minStock;

            const currentStock = Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;

            selectedItems.push({
                ...selected,
                item: {
                    ...selected.item
                },
                info: {
                    ...selected.info
                },
                currentStock
            });
        }

        const state: TimedShopState = {
            timer: createShopTimer(shop.expiryTime),
            items: selectedItems
        };

        this.saveTimedShopState(state, name);

        return state;
    }
    private static getTimedShopState(name: string): TimedShopState | null {
        const raw = world.getDynamicProperty(`shop:${name}`);

        if (typeof raw !== "string") {
            return null;
        }

        try {
            return JSON.parse(raw) as TimedShopState;
        } catch {
            return null;
        }
    }

    private static saveTimedShopState(state: TimedShopState, name: string): void {
        world.setDynamicProperty(`shop:${name}`, JSON.stringify(state));
    }
    static purchaseTimedItem(player: Player, item: ActiveTimedShopItem, amount: number): boolean {

        if (item.currentStock < amount) {
            player.sendMessage(`§cThere is not enough stock remaining.`)
            return false;
        }

        const currency = item.item.currency ?? "Money";
        const totalCost = item.item.price * amount;

        if (player.stats.get(currency) < totalCost) {
            player.sendMessage(`§cYou do not have enough ${currency}.`);

            return false;
        }

        item.currentStock -= amount;

        player.stats.remove(currency, totalCost);

        player.give(item.item.typeId, (item.item.amount ?? 1) * amount);

        return true;
    }
    static getTimedShopStock(): ActiveTimedShopItem[] {
        return this.timedShopStock;
    }
}

function createShopTimer(time: ShopExpiryTime): TimerObject {
    let timer = Timer.set(time.days ?? 0, "days");

    if (time.hours) {
        timer = Timer.add(timer, time.hours, "hours");
    }

    if (time.mins) {
        timer = Timer.add(timer, time.mins, "minutes");
    }

    if (time.seconds) {
        timer = Timer.add(timer, time.seconds, "seconds");
    }

    return timer;
}

export function getItemCapacity(container: Container, item: ItemStack): number {
    let capacity = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const current = container.getItem(slot);
        if (!current) {
            capacity += item.maxAmount;
            continue;
        }
        if (current.typeId === item.typeId && item.isStackableWith(current)) {
            capacity += current.maxAmount - current.amount;
        }
    }

    return capacity;
}

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

export function numberToRoman(num) {
    if (num <= 0) return 0;
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1, }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

function isKit(typeId: string): boolean {
    const kits = Object.values(config.kits).flat();
    if (kits.find(kit => typeId === kit.itemName)) return true;
    return false
}

export { ShopManager };

