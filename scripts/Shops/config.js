//this is the config file, im not good at describing things, but ill try to describe what i can.
//hi mom
const config = {
    mainShopNPCTag: 'shop_npc', // The tag that the main npc will have which will show all the shops. 
    // The main shop object, if you wanted to add another you would just copy an object and fill the parameters.
    shops: {
        // The object key of the shop.
        mainShop: {
            // The name to display on titles/buttons.
            displayName: 'Main Shop',
            // The description to display on the form body.
            desc: 'Welcome to the main shop, Here you can buy items relating to the shop.',
            // The types of items being sold.
            items: [
                // item definitions. pretty self explanatory, the "info" object is the info displayed on the form. (like the description of the item when buying, and the button icon.)
                { item: { typeId: 'minecraft:diamond', amount: 10 }, info: { desc: null, icon: "textures/items/diamond" } }
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
                        count: 64
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
                        count: 64
                    },
                    {
                        typeId: 'minecraft:golden_apple',
                        count: 5
                    }
                ]
            }
        ],
    }
};
Object.defineProperty(globalThis, "config", {
    value: config
});
export default config;
