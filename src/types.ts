import type { Player } from "@minecraft/server";

export interface NPC {
    tag: string;
    typeId?: string | 'minecraft:npc';
    function: (player: Player) => void;
}