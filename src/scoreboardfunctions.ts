import { Entity, world } from "@minecraft/server";

export function getScore(target: Entity | string, value: string, useZero = true) {
  try {
    const objective = world.scoreboard.getObjective(value);
    if (typeof target == "string") return objective.getScore(objective.getParticipants().find((player) => player.displayName == target)) ?? 0;
    return objective.getScore(target.scoreboardIdentity) ?? 0;
  } catch {
    return useZero ? 0 : NaN;
  }
}

export function addScore(participant: Entity | string, objectiveId: string, score: number) {
  const objective = world.scoreboard.getObjective(objectiveId);
  if (!objective)
    throw new Error(`Objective ${objectiveId} not found`);

  objective.addScore(participant, score);
}