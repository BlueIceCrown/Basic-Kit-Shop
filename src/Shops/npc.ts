import { Player, world } from "@minecraft/server";
import config from "../config";
import type { NPC } from "../types";


world.afterEvents.entityHitEntity.subscribe(({ hitEntity, damagingEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    if (!hitEntity?.isValid) return;
    const npcs = Object.values(config.npcs) as NPC[];
    const npc = npcs.find(npc => hitEntity.hasTag(npc.tag));
    if (!npc) return;
    npc.function(damagingEntity);
})