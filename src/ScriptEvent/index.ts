import { Player, system, world } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(async (event) => {
    const { sourceEntity: entity, id, message } = event;
    switch (id) {
        case 'shop:addmoney': {
            const player = entity as Player
            if (!message) {
                player.sendMessage(`Please specify a number to add.`)
            }
            const amount = parseInt(message) as number
            player.stats.add('Money', amount)
            player.sendMessage(`Added ${amount} Money.`)
            break;
        }
        case 'shop:setmoney': {
            const player = entity as Player
            if (!message) {
                player.sendMessage(`Please specify a number to set.`)
            }
            const amount = parseInt(message) as number
            player.stats.set('Money', amount)
            player.sendMessage(`Set ${amount} Money.`)
            break;
        }
        case 'shop:reroll': {
            const player = entity as Player
            const shopIds = world.getDynamicPropertyIds().filter(id => id.startsWith('shop:'))
            for (const shopId of shopIds) {
                const shopData = world.getDynamicProperty(shopId)
                if (shopData) {
                    world.setDynamicProperty(shopId, null)
                }
            }
            player.sendMessage(`Rerolled all shops.`)
            break;
        }
    }
})