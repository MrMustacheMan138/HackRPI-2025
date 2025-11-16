// src/logic/evolutions.js

export const PET_EVOLUTION_STAGES = [
  { name: 'Egg',        minLevel: 1, maxLevel: 15 },
  { name: 'Blob',       minLevel: 16, maxLevel: 31 },
  { name: 'Tree Guardian', minLevel: 32, maxLevel: 63 },
  { name: 'Forest Spirit', minLevel: 63, maxLevel: 99 },
];

export function getStageForLevel(level) {
  const stage =
    PET_EVOLUTION_STAGES.find(
      s => level >= s.minLevel && level <= s.maxLevel
    ) || PET_EVOLUTION_STAGES[0];

  return stage; // { name, minLevel, maxLevel }
}
