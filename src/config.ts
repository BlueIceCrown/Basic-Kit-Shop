//this is the config file, im not good at describing things, but ill try to describe what i can.
//hi mom

import type { Player } from "@minecraft/server";
import { mainShop } from "./Shops/menu";
import type { KitConfig } from "./types";


const config = {
    // The main NPC id, this is used to check if the player is interacting with the main shop npc.
    npcId: 'minecraft:npc',
    // The main NPC object, if you wanted to add another you would just copy an object and fill the parameters.
    npcs: {
        mainShopNPC: {
            // The NPC for the main shop.
            tag: 'mainShopNPC',
            function: (player: Player) => {
                mainShop(player);
            },
            // A different entity can be used as well in case
            npcId: 'minecraft:npc'
        },
    },
    // The main shop object, if you wanted to add another you would just copy an object and fill the parameters.
    shops: {
        // The object key of the shop.
        itemShop: {
            // The name to display on titles/buttons.
            displayName: 'Item Shop',
            // The icon to display on the form button.
            icon: 'textures/items/diamond',
            // The description to display on the form body.
            desc: 'Welcome to the item shop, Here you can buy the following items below.',
            // The types of items being sold.
            items: [
                // item definitions. pretty self explanatory, the "info" object is the info displayed on the form. (like the description of the item when buying, and the button icon.)
                { item: { typeId: 'minecraft:diamond', amount: 10 }, info: { desc: null, icon: "textures/items/diamond" } }
            ]
        },
        leatherKitsShop: {
            displayName: 'Leather Kits Shop',
            desc: 'Here you can buy the following kits below.',
            icon: 'textures/items/leather_chestplate',
            items: [
                // you can define a display name for the item for the item if you'd like (otherwise it will fall back to turning the typeId into a display name.)
                // you an also specify an amount if you wanna sell more than 1 of the item at a time.
                // you can also specify the type of currency which is just a dynamic property.
                { item: { typeId: 'custom:ultrate_kit', displayName: 'Ultrate Kit', amount: 1, price: 100, currency: "Money" }, info: { desc: null, icon: "textures/items/leather_chestplate" } },
                { item: { typeId: 'custom:basic_kit', price: 500 }, info: { desc: null, icon: "textures/items/leather_chestplate" } },
                { item: { typeId: 'custom:advanced_kit', price: 750 }, info: { desc: null, icon: "textures/items/leather_chestplate" } },
            ]
        },
        chainmailKitsShop: {
            displayName: 'Chainmail Kits Shop',
            desc: 'Here you can buy the following kits below.',
            icon: 'textures/items/chainmail_chestplate',
            items: [
                { item: { typeId: 'custom:fighter_kit', price: 1000 }, info: { desc: null, icon: "textures/items/chainmail_chestplate" } },
                { item: { typeId: 'custom:warrior_kit', price: 2000 }, info: { desc: null, icon: "textures/items/chainmail_chestplate" } },
                { item: { typeId: 'custom:champion_kit', price: 2500 }, info: { desc: null, icon: "textures/items/chainmail_chestplate" } },
            ]
        },
        ironKitsShop: {
            displayName: 'Iron Kits Shop',
            desc: 'Here you can buy the following kits below.',
            icon: 'textures/items/iron_chestplate',
            items: [
                { item: { typeId: 'custom:outstander_kit', price: 3000 }, info: { desc: null, icon: "textures/items/iron_chestplate" } },
                { item: { typeId: 'custom:elite_kit', price: 5000 }, info: { desc: null, icon: "textures/items/iron_chestplate" } },
                { item: { typeId: 'custom:legendary_kit', price: 7500 }, info: { desc: null, icon: "textures/items/iron_chestplate" } },
            ]
        },
        diamondKitsShop: {
            displayName: 'Diamond Kits Shop',
            desc: 'Here you can buy the following kits below.',
            icon: 'textures/items/diamond_chestplate',
            items: [
                { item: { typeId: 'custom:powerhouse_kit', price: 10000 }, info: { desc: null, icon: "textures/items/diamond_chestplate" } },
                { item: { typeId: 'custom:ranger_kit', price: 20000 }, info: { desc: null, icon: "textures/items/diamond_chestplate" } },
                { item: { typeId: 'custom:ultimate_kit', price: 30000 }, info: { desc: null, icon: "textures/items/diamond_chestplate" } },
            ]
        },
        timedShop: {
            displayName: 'Timed Shop',
            desc: 'Welcome'
        }
    },
    // The main kits object. This is based off of custom added items that are later right clicked to give the player a kit.
    kits: {
        // The object key of the kits. It can be any name but its mainly used to define the categories of certain kits for the shop. (sorry if thats worded badly.)
        leatherKits: [
            {
                // Enchants to fallback too in case there is none specified to begin with.
                staticEnchants: [
                    { id: "protection", level: 1 },
                    { id: "unbreaking", level: 1 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 1 }
                ],
                // The name of the item that will be right clicked to give the player the kit.
                itemName: 'custom:ultrate_kit',
                // The display name of the kit.
                displayName: 'Ultrate Kit',
                // The description of the kit.
                desc: `Tier: Leather`,
                // The items that will be given to the player when they right click the item.
                items: [
                    {
                        // this is all self explanatory
                        typeId: 'minecraft:leather_helmet',
                        amount: 1,
                        // if you want lore for some reason
                        lore: [],
                        // enchants! (vanilla ones ofc) specify if certain enchants need to be changed on a certain item.
                        enchantments: [
                            { id: "unbreaking", level: 1 },
                            { id: "mending", level: 1 },
                            { id: "protection", level: 1 }
                        ]
                    },
                    {
                        typeId: 'minecraft:leather_chestplate'
                    },
                    {
                        typeId: 'minecraft:leather_leggings'
                    },
                    {
                        typeId: 'minecraft:leather_boots'
                    },
                    {
                        typeId: 'minecraft:wooden_sword'
                    }
                ]
            },
            {
                itemName: 'custom:basic_kit',
                displayName: 'Basic Kit',
                desc: `Tier: Leather`,
                staticEnchants: [
                    { id: "protection", level: 2 },
                    { id: "unbreaking", level: 2 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 2 }
                ],
                items: [
                    {
                        typeId: 'minecraft:leather_helmet'
                    },
                    {
                        typeId: 'minecraft:leather_chestplate'
                    },
                    {
                        typeId: 'minecraft:leather_leggings'
                    },
                    {
                        typeId: 'minecraft:leather_boots'
                    },
                    {
                        typeId: 'minecraft:wooden_sword'
                    }
                ]
            },
            {
                itemName: 'custom:advanced_kit',
                displayName: 'Advanced Kit',
                desc: `Tier: Leather`,
                staticEnchants: [
                    { id: "protection", level: 3 },
                    { id: "unbreaking", level: 3 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 3 }
                ],
                items: [
                    {
                        typeId: 'minecraft:leather_helmet'
                    },
                    {
                        typeId: 'minecraft:leather_chestplate'
                    },
                    {
                        typeId: 'minecraft:leather_leggings'
                    },
                    {
                        typeId: 'minecraft:leather_boots'
                    },
                    {
                        typeId: 'minecraft:wooden_sword'
                    }
                ]
            }
        ],
        chainmailKits: [
            {
                itemName: 'custom:fighter_kit',
                displayName: 'Fighter Kit',
                desc: `Tier: Chainmail`,
                staticEnchants: [
                    { id: "protection", level: 1 },
                    { id: "unbreaking", level: 1 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 1 }
                ],
                items: [
                    {
                        typeId: 'minecraft:chainmail_helmet'
                    },
                    {
                        typeId: 'minecraft:chainmail_chestplate'
                    },
                    {
                        typeId: 'minecraft:chainmail_leggings'
                    },
                    {
                        typeId: 'minecraft:chainmail_boots'
                    },
                    {
                        typeId: 'minecraft:stone_sword'
                    }
                ]
            },
            {
                itemName: 'custom:warrior_kit',
                displayName: 'Warrior Kit',
                desc: `Tier: Chainmail`,
                staticEnchants: [
                    { id: "protection", level: 2 },
                    { id: "unbreaking", level: 2 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 2 }
                ],
                items: [
                    {
                        typeId: 'minecraft:chainmail_helmet'
                    },
                    {
                        typeId: 'minecraft:chainmail_chestplate'
                    },
                    {
                        typeId: 'minecraft:chainmail_leggings'
                    },
                    {
                        typeId: 'minecraft:chainmail_boots'
                    },
                    {
                        typeId: 'minecraft:stone_sword'
                    }
                ]
            },
            {
                itemName: 'custom:champion_kit',
                displayName: 'Champion Kit',
                desc: `Tier: Chainmail`,
                staticEnchants: [
                    { id: "protection", level: 3 },
                    { id: "unbreaking", level: 3 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 3 }
                ],
                items: [
                    {
                        typeId: 'minecraft:chainmail_helmet'
                    },
                    {
                        typeId: 'minecraft:chainmail_chestplate'
                    },
                    {
                        typeId: 'minecraft:chainmail_leggings'
                    },
                    {
                        typeId: 'minecraft:chainmail_boots'
                    },
                    {
                        typeId: 'minecraft:stone_sword'
                    }
                ]
            }
        ],
        ironKits: [
            {
                itemName: 'custom:outstander_kit',
                displayName: 'Outstander Kit',
                desc: `Tier: Iron`,
                staticEnchants: [
                    { id: "protection", level: 1 },
                    { id: "unbreaking", level: 1 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 1 }
                ],
                items: [
                    {
                        typeId: 'minecraft:iron_helmet'
                    },
                    {
                        typeId: 'minecraft:iron_chestplate'
                    },
                    {
                        typeId: 'minecraft:iron_leggings'
                    },
                    {
                        typeId: 'minecraft:iron_boots'
                    },
                    {
                        typeId: 'minecraft:iron_sword'
                    }
                ]
            },
            {
                itemName: 'custom:elite_kit',
                displayName: 'Elite Kit',
                desc: `Tier: Iron`,
                staticEnchants: [
                    { id: "protection", level: 2 },
                    { id: "unbreaking", level: 2 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 2 }
                ],
                items: [
                    {
                        typeId: 'minecraft:iron_helmet'
                    },
                    {
                        typeId: 'minecraft:iron_chestplate'
                    },
                    {
                        typeId: 'minecraft:iron_leggings'
                    },
                    {
                        typeId: 'minecraft:iron_boots'
                    },
                    {
                        typeId: 'minecraft:iron_sword'
                    }
                ]
            },
            {
                itemName: 'custom:legendary_kit',
                displayName: 'Legendary Kit',
                desc: `Tier: Iron`,
                staticEnchants: [
                    { id: "protection", level: 3 },
                    { id: "unbreaking", level: 3 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 3 }
                ],
                items: [
                    {
                        typeId: 'minecraft:iron_helmet'
                    },
                    {
                        typeId: 'minecraft:iron_chestplate'
                    },
                    {
                        typeId: 'minecraft:iron_leggings'
                    },
                    {
                        typeId: 'minecraft:iron_boots'
                    },
                    {
                        typeId: 'minecraft:iron_sword'
                    }
                ]
            }
        ],
        diamondKits: [
            {
                itemName: 'custom:powerhouse_kit',
                displayName: 'Powerhouse Kit',
                desc: `Tier: Diamond`,
                staticEnchants: [
                    { id: "protection", level: 1 },
                    { id: "unbreaking", level: 1 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 1 }
                ],
                items: [
                    {
                        typeId: 'minecraft:diamond_helmet'
                    },
                    {
                        typeId: 'minecraft:diamond_chestplate'
                    },
                    {
                        typeId: 'minecraft:diamond_leggings'
                    },
                    {
                        typeId: 'minecraft:diamond_boots'
                    },
                    {
                        typeId: 'minecraft:diamond_sword'
                    }
                ]
            },
            {
                itemName: 'custom:ranger_kit',
                displayName: 'Ranger Kit',
                desc: `Tier: Diamond`,
                staticEnchants: [
                    { id: "protection", level: 2 },
                    { id: "unbreaking", level: 2 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 1 },
                    { id: "power", level: 3 }
                ],
                items: [
                    {
                        typeId: 'minecraft:diamond_helmet'
                    },
                    {
                        typeId: 'minecraft:diamond_chestplate'
                    },
                    {
                        typeId: 'minecraft:diamond_leggings'
                    },
                    {
                        typeId: 'minecraft:diamond_boots'
                    },
                    {
                        typeId: 'minecraft:diamond_sword'
                    },
                    {
                        typeId: 'minecraft:bow'
                    },
                    {
                        typeId: 'minecraft:arrow',
                        amount: 64
                    }
                ]
            },
            {
                itemName: 'custom:ultimate_kit',
                displayName: 'Ultimate Kit',
                desc: `Tier: Diamond`,
                staticEnchants: [
                    { id: "protection", level: 3 },
                    { id: "unbreaking", level: 3 },
                    { id: "mending", level: 1 },
                    { id: "sharpness", level: 3 },
                    { id: "power", level: 4 }
                ],
                items: [
                    {
                        typeId: 'minecraft:diamond_helmet'
                    },
                    {
                        typeId: 'minecraft:diamond_chestplate'
                    },
                    {
                        typeId: 'minecraft:diamond_leggings'
                    },
                    {
                        typeId: 'minecraft:diamond_boots'
                    },
                    {
                        typeId: 'minecraft:diamond_sword'
                    },
                    {
                        typeId: 'minecraft:bow'
                    },
                    {
                        typeId: 'minecraft:arrow',
                        amount: 64
                    },
                    {
                        typeId: 'minecraft:golden_apple',
                        amount: 5
                    }
                ]
            }
        ],
    } as KitConfig
}

Object.defineProperty(globalThis, "config", {
    value: config
});

export default config