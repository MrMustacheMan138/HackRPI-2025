// Shape of eco stats the app will track
export const initialEcoStats = {
  co2Saved: 0,        // in grams
  plasticReduced: 0,  // in bottles/items
  energySaved: 0      // in kWh or "points"
};

// All the eco actions your app supports
// Person 1 can use this list to build buttons on the Actions screen
export const ECO_ACTIONS = {
  WALK_INSTEAD_OF_DRIVE: {
    id: 'walk',
    label: 'Walked instead of drove',
    co2: 300,          // grams CO₂ saved (example number)
    plastic: 0,
    energy: 5
  },
  RECYCLE: {
    id: 'recycle',
    label: 'Recycled properly',
    co2: 80,
    plastic: 0.5,
    energy: 4
  },
  TURN_OFF_LIGHTS: {
    id: 'turn_off_lights',
    label: 'Turned off lights',
    co2: 40,
    plastic: 0,
    energy: 6
  }
};

// Helper to get a list for UI buttons
export function getEcoActionsList() {
  return Object.values(ECO_ACTIONS);
}

// Core function: given current stats + action type → new stats
export function applyEcoAction(currentStats, actionId) {
  const action = Object.values(ECO_ACTIONS).find(a => a.id === actionId);
  if (!action) {
    // Unknown action, return stats unchanged
    return currentStats;
  }

  return {
    co2Saved: currentStats.co2Saved + (action.co2 || 0),
    plasticReduced: currentStats.plasticReduced + (action.plastic || 0),
    energySaved: currentStats.energySaved + (action.energy || 0)
  };
}