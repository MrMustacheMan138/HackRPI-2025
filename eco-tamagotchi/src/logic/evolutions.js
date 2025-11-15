// src/logic/evolutions.js

export const PET_EVOLUTION_STAGES = [
  { name: 'Sprout',        minLevel: 1, maxLevel: 1 },
  { name: 'Sapling',       minLevel: 2, maxLevel: 2 },
  { name: 'Tree Guardian', minLevel: 3, maxLevel: 3 },
  { name: 'Forest Spirit', minLevel: 4, maxLevel: 99 },
];

export function getStageForLevel(level) {
  const stage =
    PET_EVOLUTION_STAGES.find(
      s => level >= s.minLevel && level <= s.maxLevel
    ) || PET_EVOLUTION_STAGES[0];

  return stage; // { name, minLevel, maxLevel }
}
