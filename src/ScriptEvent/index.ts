import { Player, system } from "@minecraft/server";

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
    }
})