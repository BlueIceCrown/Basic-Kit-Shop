import type { Player } from "@minecraft/server";
import type { Kit } from "./Kits/types";

export interface NPC {
    tag: string;
    typeId?: string | 'minecraft:npc';
    function: (player: Player) => void;
}

export type KitConfig = {
    leatherKits: Kit[];
    chainmailKits: Kit[];
    ironKits: Kit[];
    diamondKits: Kit[];
};