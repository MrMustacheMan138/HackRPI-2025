export const PET_EVOLUTION_STAGES = [
  {
    name: 'Sprout',
    minLevel: 1,
    maxLevel: 3,
    color: '#A3E635'
  },
  {
    name: 'Sapling',
    minLevel: 4,
    maxLevel: 7,
    color: '#22C55E'
  },
  {
    name: 'Tree Guardian',
    minLevel: 8,
    maxLevel: 12,
    color: '#16A34A'
  },
  {
    name: 'Forest Spirit',
    minLevel: 13,
    maxLevel: 99,
    color: '#15803D'
  }
];

export function getStageForLevel(level) {
  const stage =
    PET_EVOLUTION_STAGES.find(
      s => level >= s.minLevel && level <= s.maxLevel
    ) || PET_EVOLUTION_STAGES[0];

  return stage;
}
