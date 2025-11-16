// achievements.js
import achievementsData from "../storage/achievements.json";

/**
 * Check if a specific achievement is unlocked
 * @param {object} ach - Achievement object from JSON
 * @param {object} pet - Pet state
 * @param {array} history - Pet action history
 * @returns {boolean}
 */
function isUnlocked(ach, pet, history) {
  if (ach.type === "history") {
    return history.some((h) => h.actionType === ach.key);
  } else if (ach.type === "pet") {
    return pet.level >= ach.key;
  }
  return false;
}

/**
 * Get all unlocked achievements
 * @param {object} pet
 * @param {array} history
 * @returns {array} - List of unlocked achievements
 */
export function getUnlockedAchievements(pet, history) {
  return achievementsData.filter((ach) => isUnlocked(ach, pet, history));
}

/**
 * Get only newly unlocked achievements
 * @param {object} pet
 * @param {array} history
 * @param {array} unlocked - Already unlocked achievements
 * @returns {array} - List of new achievements
 */
export function checkNewAchievements(pet, history, unlocked) {
  const currentlyUnlocked = getUnlockedAchievements(pet, history);
  return currentlyUnlocked.filter(
    (ach) => !unlocked.some((u) => u.id === ach.id)
  );
}
