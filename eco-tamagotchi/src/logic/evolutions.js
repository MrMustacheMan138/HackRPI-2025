// src/logic/evolutions.js

export const PET_EVOLUTION_STAGES = [
  { name: 'Egg',        minLevel: 1, maxLevel: 16 },
  { name: 'Blob',       minLevel: 16, maxLevel: 32 },
  { name: 'Tree Guardian', minLevel: 32, maxLevel: 64 },
  { name: 'Forest Spirit', minLevel: 64, maxLevel: 99 },
];

export function getStageForLevel(level) {
  const stage =
    PET_EVOLUTION_STAGES.find(
      s => level >= s.minLevel && level <= s.maxLevel
    ) || PET_EVOLUTION_STAGES[0];

  return stage; // { name, minLevel, maxLevel }
}
