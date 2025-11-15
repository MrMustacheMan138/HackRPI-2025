export const initialEcoStats = {
  co2Saved: 0,       
  plasticReduced: 0,
  energySaved: 0,
};

export const ECO_ACTIONS = {
  WALK_INSTEAD_OF_DRIVE: {
    id: 'walk',
    label: 'Walked instead of drove',
    co2: 300,
    plastic: 0,
    energy: 5,
  },
  TURN_OFF_LIGHT_WHEN_LEAVING: {
    id: 'turn_off_room_lights',
    label: 'Turned off lights when leaving a room',
    co2: 60,
    plastic: 0,
    energy: 8,
  },
  RECYCLE: {
    id: 'recycle',
    label: 'Recycled properly',
    co2: 80,
    plastic: 0.5,
    energy: 4,
  },
};

export function getEcoActionsList() {
  return Object.values(ECO_ACTIONS);
}

export function applyEcoAction(currentStats, actionId) {
  const action = Object.values(ECO_ACTIONS).find(a => a.id === actionId);
  if (!action) return currentStats;

  return {
    co2Saved: currentStats.co2Saved + (action.co2 || 0),
    plasticReduced: currentStats.plasticReduced + (action.plastic || 0),
    energySaved: currentStats.energySaved + (action.energy || 0),
  };
}
