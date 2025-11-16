// src/logic/evolutions.js

export const PET_EVOLUTION_STAGES = [
  { name: 'Sprout',        minLevel: 1, maxLevel: 16 },
  { name: 'Sapling',       minLevel: 16, maxLevel: 32 },
  { name: 'Tree Guardian', minLevel: 32, maxLevel: 64 },
  { name: 'Forest Spirit', minLevel: 44, maxLevel: 99 },
];

export function getStageForLevel(level) {
  const stage =
    PET_EVOLUTION_STAGES.find(
      s => level >= s.minLevel && level <= s.maxLevel
    ) || PET_EVOLUTION_STAGES[0];

  return stage; // { name, minLevel, maxLevel }
}
