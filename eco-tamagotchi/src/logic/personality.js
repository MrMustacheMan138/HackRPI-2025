// src/logic/personality.js

// Example thresholds – tweak as you like
const HIGH_CO2_SAVED = 1000;
const LOW_ENERGY = 30;

const ACTION_MESSAGES = {
  walk: "Your pet loved the fresh air from your walk! 🌿",
  reusable_bottle: "Sip sip hooray! Less plastic makes your pet smile. 🍼➡️🚫",
  recycle: "Clink! Recycling makes your pet feel refreshed. ♻️",
  turn_off_lights: "Nice! Your pet can see the stars now. ✨"
};

/**
 * petState: { mood: string, energy: number, xp: number, level: number }
 * ecoStats: { co2Saved, plasticReduced, energySaved }
 * lastActionId: string | null
 */
export function getPersonalityMessage(petState, ecoStats, lastActionId) {
  // 1. Prefer a reaction to the most recent action
  if (lastActionId && ACTION_MESSAGES[lastActionId]) {
    return ACTION_MESSAGES[lastActionId];
  }

  // 2. Mood/energy-based messages
  if (petState.mood === 'sad' || petState.energy < LOW_ENERGY) {
    return "Your pet looks sluggish… maybe time for another eco-action?";
  }

  // 3. Big milestone eco-stats messages
  if (ecoStats.co2Saved >= HIGH_CO2_SAVED) {
    return "Your pet can breathe easier already—you’ve saved so much CO₂! 🌎";
  }

  if (ecoStats.plasticReduced >= 10) {
    return "Your pet is swimming in cleaner oceans thanks to you. 🐠";
  }

  // 4. Default message
  return "Your pet is feeling okay. Keep up the eco-habits!";
}
