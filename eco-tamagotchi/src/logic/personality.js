// src/logic/personality.js

// const ACTION_MESSAGES = {
//   recycle: 'Your pet is proud you recycled! ♻️',
//   walk: 'Your pet loved the fresh air from your walk! 🌿',
//   energySave: 'Your pet glows with all that saved energy! 💡',
// };

export function getPersonalityMessage(petState, lastActionId) {
  // Prefer specific message based on action
  // if (lastActionId && ACTION_MESSAGES[lastActionId]) {
  //   return ACTION_MESSAGES[lastActionId];
  // }

  // If pet is sad
  if (petState.mood === 'sad') {
    return 'Your pet looks sluggish… maybe time for another eco action?';
  }

  // Level-based flavor
  if (petState.level >= 4) {
    return 'Your pet has become a mighty Forest Spirit! 🌳';
  }

  if (petState.level >= 2) {
    return 'Your pet feels stronger with each eco-friendly habit! 💪';
  }

  // Default
  return 'Your pet is feeling okay. Keep up the eco habits! 🌱';
}
