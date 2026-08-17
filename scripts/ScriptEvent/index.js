import { Player, system } from "@minecraft/server";
system.afterEvents.scriptEventReceive.subscribe(async (event) => {
    const { sourceEntity: entity, id, message } = event;
    switch (id) {
        case 'shop:addmoney':
            const player = entity;
            if (!message) {
                player.sendMessage(`Please specify a number to add.`);
            }
            const amount = parseInt(message);
            player.stats.add('Money', amount);
            player.sendMessage(`Added ${amount} Money.`);
    }
});
