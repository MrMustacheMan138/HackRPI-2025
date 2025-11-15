// src/logic/impact_model.js

// All the eco actions your app supports
// Person 1 can also use this list to build buttons if they want
export const ECO_ACTIONS = {
  RECYCLE: {
    id: 'recycle',
    label: 'Recycle ♻️',
    xp: 5,
  },
  WALK: {
    id: 'walk',
    label: 'Walk 🚶',
    xp: 8,
  },
  SAVE_ENERGY: {
    id: 'energySave',
    label: 'Save Energy 💡',
    xp: 4,
  },
};

// Optional helper to get a list (for UI buttons)
export function getEcoActionsList() {
  return Object.values(ECO_ACTIONS);
}

// Core function used by petState.js:
// given an action type, how much XP should we award?
export function getXpForAction(actionType) {
  const action = Object.values(ECO_ACTIONS).find(a => a.id === actionType);
  if (!action) return 3; // default XP if unknown
  return action.xp;
}
