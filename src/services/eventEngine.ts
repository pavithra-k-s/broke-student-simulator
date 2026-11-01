import { GameEvent, EventChoice } from '../types/gameplay';
import { DifficultyLevel } from '../types/profile';
import { GAME_EVENTS } from '../data/events';

/**
 * Select a random event for a given day and difficulty, avoiding recent repeats.
 */
export function selectDailyEvent(
  difficulty: DifficultyLevel,
  recentlyResolvedIds: string[] = [],
  daySeed?: number
): GameEvent {
  // Filter eligible events by difficulty
  const eligible = GAME_EVENTS.filter((evt) =>
    evt.difficultyAllowed.includes(difficulty)
  );

  // Filter out recent repeats if we have enough events left
  const unrepeated = eligible.filter(
    (evt) => !recentlyResolvedIds.slice(-6).includes(evt.id)
  );

  const pool = unrepeated.length > 0 ? unrepeated : eligible;

  // Apply difficulty multipliers to weights
  const weightedPool = pool.map((evt) => {
    let weight = evt.weight;

    if (difficulty === 'EASY') {
      if (evt.category === 'Luck') weight *= 2.0;
      if (evt.category === 'Disaster') weight *= 0.5;
    } else if (difficulty === 'HARD') {
      if (evt.category === 'Disaster') weight *= 2.2;
      if (evt.category === 'Luck') weight *= 0.5;
    }

    return { event: evt, weight };
  });

  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);

  // If a seed (simulatedDay) is provided, make it deterministic per day or random
  let randomVal = daySeed
    ? ((Math.sin(daySeed * 9999 + 123) + 1) / 2) * totalWeight
    : Math.random() * totalWeight;

  for (const item of weightedPool) {
    if (randomVal <= item.weight) {
      return item.event;
    }
    randomVal -= item.weight;
  }

  return weightedPool[0].event;
}

export function findEventById(id: string): GameEvent | undefined {
  return GAME_EVENTS.find((e) => e.id === id);
}

export function findChoice(event: GameEvent, choiceId: string): EventChoice | undefined {
  return event.choices.find((c) => c.id === choiceId);
}

