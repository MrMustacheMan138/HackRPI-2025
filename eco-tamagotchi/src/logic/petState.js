// src/logic/petState.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Where we store stuff
const PET_KEY = "pet_state_v2";
const HISTORY_KEY = "pet_history_v1";

// 💚 Moods go from best -> worst
const MOOD_STEPS = ["happy", "okay", "meh", "sad", "miserable"];

// How fast mood decays if player does nothing (e.g. one step every 6h)
const DECAY_INTERVAL_MS = 15 * 1000; // 15 seconds;

// XP per action (tune however you like)
const ACTION_XP = {
  recycle: 5,
  walk: 10,
  energySave: 7,
};

// Simple level-up rule: every 20 xp = +1 level
const XP_PER_LEVEL = 20;

function defaultPet() {
  return {
    mood: "happy",
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
    stage: { name: "Egg" },
    hasRunAway: false, // 👈 important flag
  };
}

/**
 * Decrease mood based on how long it's been since lastUpdated.
 * If it drops below the lowest mood, pet "runs away".
 */
function applyTimeDecay(pet) {
  const now = Date.now();
  const diff = now - (pet.lastUpdated || now);

  if (diff <= 0) return pet;

  const steps = Math.floor(diff / DECAY_INTERVAL_MS);
  if (steps <= 0) return pet;

  let moodIndex = MOOD_STEPS.indexOf(pet.mood);
  if (moodIndex === -1) moodIndex = 1; // default to "okay" if unknown

  moodIndex += steps;

  // Pet has gone past "miserable" → runs away
  if (moodIndex >= MOOD_STEPS.length) {
    return {
      ...pet,
      mood: "gone",
      hasRunAway: true,
      stage: { name: "Ran away..." },
      lastUpdated: now,
    };
  }

  return {
    ...pet,
    mood: MOOD_STEPS[moodIndex],
    lastUpdated: now,
  };
}

/**
 * Improve mood one step (e.g. after eco action).
 * Won't bring back a runaway pet.
 */
function improveMood(mood) {
  if (mood === "gone") return "gone";

  let idx = MOOD_STEPS.indexOf(mood);
  if (idx === -1) idx = 1;
  if (idx === 0) return MOOD_STEPS[0]; // already best
  return MOOD_STEPS[idx - 1];
}

/**
 * Compute new level from XP.
 */
function computeLevelFromXp(xp) {
  const baseLevel = 1;
  return baseLevel + Math.floor(xp / XP_PER_LEVEL);
}

/**
 * You can map level ranges to a stage name if you want.
 */
function computeStage(level) {
  if (level >= 64) return { name: "Mega Tama" };
  if (level >= 32) return { name: "Big Tama" };
  if (level >= 16) return { name: "Baby Tama" };
  return { name: "Egg" };
}

// ─────────────────────────────────────
// Public API
// ─────────────────────────────────────

export async function getPetState() {
  const stored = await AsyncStorage.getItem(PET_KEY);
  let pet = stored ? JSON.parse(stored) : defaultPet();

  // Apply time-based mood decay & possible runaway
  pet = applyTimeDecay(pet);

  await AsyncStorage.setItem(PET_KEY, JSON.stringify(pet));
  return pet;
}

/**
 * Log an action (recycle/walk/energySave + detail).
 * If pet has run away, we do NOT let the user fix it (by design).
 */
export async function logAction(actionType, detail) {
  let pet = await getPetState(); // this already applies decay

  // 🏃‍♀️ Pet ran away → ignore actions
  if (pet.hasRunAway) {
    // You CAN still log history if you want:
    await appendHistory({
      timestamp: Date.now(),
      actionType,
      detail,
      note: "Tried action but pet had already run away",
    });
    return pet;
  }

  // XP gain
  const xpGain = ACTION_XP[actionType] ?? 5;
  const newXp = (pet.xp || 0) + xpGain;
  const newLevel = computeLevelFromXp(newXp);
  const newStage = computeStage(newLevel);

  const updatedPet = {
    ...pet,
    xp: newXp,
    level: newLevel,
    stage: newStage,
    mood: improveMood(pet.mood),
    lastUpdated: Date.now(),
  };

  await AsyncStorage.setItem(PET_KEY, JSON.stringify(updatedPet));

  // Save to history
  await appendHistory({
    timestamp: Date.now(),
    actionType,
    detail,
    xpGain,
    newXp,
    newLevel,
  });

  return updatedPet;
}

/**
 * Reset pet so the player can start over.
 * This is what your sidebar "Reset Tama" button calls.
 */
export async function resetPet() {
  const pet = defaultPet();
  await AsyncStorage.setItem(PET_KEY, JSON.stringify(pet));
  // If you want to clear history too, wipe it here:
  // await AsyncStorage.removeItem(HISTORY_KEY);
  return pet;
}

/**
 * History helpers
 */
async function appendHistory(entry) {
  const stored = await AsyncStorage.getItem(HISTORY_KEY);
  const history = stored ? JSON.parse(stored) : [];
  history.unshift(entry); // newest first
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function loadHistory() {
  const stored = await AsyncStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

// // src/logic/petState.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { getXpForAction } from './impact_model';
// import { getStageForLevel } from './evolutions';

// const STORAGE_KEY = 'ECO_PET_STATE';
// const HISTORY_KEY = 'ECO_PET_HISTORY';

// // --- DEFAULT PET STATE ---
// const defaultPet = {
//   mood: 'neutral',
//   xp: 0,
//   level: 1,
//   stage: getStageForLevel(1),
//   lastUpdated: Date.now(),
// };

// // --- LOAD PET STATE ---
// export async function loadPetState() {
//   try {
//     const data = await AsyncStorage.getItem(STORAGE_KEY);
//     if (!data) return { ...defaultPet };

//     const parsed = JSON.parse(data);
//     // merge to ensure new fields exist
//     return { ...defaultPet, ...parsed };
//   } catch (err) {
//     console.log('Error loading pet:', err);
//     return { ...defaultPet };
//   }
// }

// // --- SAVE PET STATE ---
// async function savePetState(pet) {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
// }

// // --- LOAD HISTORY ---
// export async function loadHistory() {
//   try {
//     const data = await AsyncStorage.getItem(HISTORY_KEY);
//     if (!data) return [];
//     return JSON.parse(data);
//   } catch (err) {
//     console.log('Error loading history:', err);
//     return [];
//   }
// }

// // --- SAVE HISTORY ---
// async function saveHistory(history) {
//   await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
// }

// // --- ADD HISTORY ENTRY ---
// async function addHistoryEntry(actionType, xpGain) {
//   const history = await loadHistory();

//   const entry = {
//     id: Date.now().toString(),
//     action: actionType,
//     xp: xpGain,
//     timestamp: Date.now(),
//   };

//   // Add to beginning (newest first), keep last 50 entries
//   history.unshift(entry);
//   const trimmedHistory = history.slice(0, 50);

//   await saveHistory(trimmedHistory);
// }

// // --- DECAY LOGIC ---
// function applyDecay(pet) {
//   const now = Date.now();
//   const hoursPassed = Math.floor((now - pet.lastUpdated) / (1000 * 60 * 60));

//   if (hoursPassed > 0) {
//     pet.mood = 'sad';
//     pet.xp = Math.max(0, pet.xp - hoursPassed * 2);
//     pet.lastUpdated = now;
//   }

//   return pet;
// }

// // --- LEVEL-UP LOGIC ---
// function computeLevel(xp) {
//   const rawLevel = Math.floor(xp / 10) + 1; // 0–9 xp => 1, 10–19 => 2, etc.
//   const clamped = Math.max(1, Math.min(99, rawLevel)); // keep between 1 and 99
//   return clamped;
// }

// // --- LOG ACTIONS (called by UI when you press buttons) ---
// export async function logAction(actionType, detail) {
//   let pet = await loadPetState();
//   pet = applyDecay(pet);

//   // 1. Get XP reward based on which action it is
//   const xpGain = getXpForAction(actionType, detail);
//   pet.xp += xpGain;

//   // 2. Update level from XP
//   pet.level = computeLevel(pet.xp);

//   // 3. Update evolution stage
//   pet.stage = getStageForLevel(pet.level);

//   // 5. Mood + timestamp
//   pet.mood = 'happy';
//   pet.lastUpdated = Date.now();

//   // 6. Save to history
//   await addHistoryEntry(actionType, xpGain);

//   await savePetState(pet);
//   return pet;
// }

// // --- GET PET STATE ON STARTUP ---
// export async function getPetState() {
//   let pet = await loadPetState();
//   pet = applyDecay(pet);
//   pet.stage = getStageForLevel(pet.level);
//   await savePetState(pet);
//   return pet;
// }

// // --- RESET PET ---
// export async function resetPet() {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
//   return { ...defaultPet };
// }
