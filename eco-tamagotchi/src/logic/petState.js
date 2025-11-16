// src/logic/petState.js
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getXpForAction } from './impact_model';
import { getPersonalityMessage } from './personality';
import { getStageForLevel } from './evolutions';

const STORAGE_KEY = 'ECO_PET_STATE';
const HISTORY_KEY = 'ECO_PET_HISTORY';

// --- DEFAULT PET STATE ---
const defaultPet = {
  mood: 'neutral',
  xp: 0,
  level: 1,
  lastActionId: null,
  message: "Hi! I'm your eco-pet 🌱",
  stage: getStageForLevel(1), // { name: 'Sprout', ... }
  lastUpdated: Date.now(),
};

// --- LOAD PET STATE ---
export async function loadPetState() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return { ...defaultPet };

    const parsed = JSON.parse(data);
    // merge to ensure new fields exist
    return { ...defaultPet, ...parsed };
  } catch (err) {
    console.log('Error loading pet:', err);
    return { ...defaultPet };
  }
}

// --- SAVE PET STATE ---
async function savePetState(pet) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

// --- NEW: LOAD HISTORY ---
export async function loadHistory() {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.log('Error loading history:', err);
    return [];
  }
}

// --- NEW: SAVE HISTORY ---
async function saveHistory(history) {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// --- NEW: ADD HISTORY ENTRY ---
async function addHistoryEntry(actionType, xpGain) {
  const history = await loadHistory();
  
  const entry = {
    id: Date.now().toString(),
    action: actionType,
    xp: xpGain,
    timestamp: Date.now(),
  };
  
  // Add to beginning (newest first), keep last 50 entries
  history.unshift(entry);
  const trimmedHistory = history.slice(0, 50);
  
  await saveHistory(trimmedHistory);
}

// --- DECAY LOGIC ---
function applyDecay(pet) {
  const now = Date.now();
  const hoursPassed = Math.floor((now - pet.lastUpdated) / (1000 * 60 * 60));

  if (hoursPassed > 0) {
    pet.mood = 'sad';
    pet.xp = Math.max(0, pet.xp - hoursPassed * 2);
    pet.lastUpdated = now;
  }

  return pet;
}

// --- LEVEL-UP LOGIC ---
function computeLevel(xp) {
  const rawLevel = Math.floor(xp / 10) + 1;  // 0–9 xp => 1, 10–19 => 2, etc.
  const clamped = Math.max(1, Math.min(99, rawLevel)); // keep between 1 and 99
  return clamped;
}

// --- LOG ACTIONS (called by UI when you press buttons) ---
export async function logAction(actionType) {
  let pet = await loadPetState();
  pet = applyDecay(pet);

  // 1. Get XP reward based on which action it is
  const xpGain = getXpForAction(actionType);
  pet.xp += xpGain;

  // 2. Update level from XP
  pet.level = computeLevel(pet.xp);

  // 3. Update evolution stage
  pet.stage = getStageForLevel(pet.level);

  // 4. Update personality message
  pet.lastActionId = actionType;
  pet.message = getPersonalityMessage(pet, actionType);

  // 5. Mood + timestamp
  pet.mood = 'happy';
  pet.lastUpdated = Date.now();

  // 6. NEW: Save to history
  await addHistoryEntry(actionType, xpGain);

  await savePetState(pet);
  return pet;
}

// --- GET PET STATE ON STARTUP ---
export async function getPetState() {
  let pet = await loadPetState();
  pet = applyDecay(pet);
  pet.stage = getStageForLevel(pet.level);
  await savePetState(pet);
  return pet;
}

// --- RESET PET ---
export async function resetPet() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
  return { ...defaultPet };
}


// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEY = "ECO_PET_STATE";

// // --- DEFAULT PET STATE ---
// const defaultPet = {
//   mood: "neutral",
//   xp: 0,
//   level: 1,
//   lastUpdated: Date.now(),
// };

// // --- LOAD PET STATE FROM STORAGE ---
// export async function loadPetState() {
//   try {
//     const data = await AsyncStorage.getItem(STORAGE_KEY);
//     if (data) return JSON.parse(data);

//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
//     return { ...defaultPet };
//   } catch (err) {
//     console.log("Error loading pet:", err);
//     return { ...defaultPet };
//   }
// }

// // --- SAVE PET STATE ---
// async function savePetState(pet) {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
// }

// // --- DECAY LOGIC ---
// function applyDecay(pet) {
//   const now = Date.now();
//   const hoursPassed = Math.floor((now - pet.lastUpdated) / (1000 * 60 * 60));

//   if (hoursPassed > 0) {
//     pet.mood = "sad";
//     pet.xp = Math.max(0, pet.xp - hoursPassed * 2);
//     pet.lastUpdated = now;
//   }

//   return pet;
// }

// // --- LEVEL-UP LOGIC ---
// function computeLevel(xp) {
//   if (xp < 20) return 1;
//   if (xp < 50) return 2;
//   if (xp < 100) return 3;
//   return 4;
// }

// // --- LOG ACTIONS ---
// export async function logAction(actionType) {
//   let pet = await loadPetState();
//   pet = applyDecay(pet);

//   const xpRewards = {
//     recycle: 5,
//     walk: 8,
//     energySave: 4,
//   };

//   pet.xp += xpRewards[actionType] || 3;
//   pet.level = computeLevel(pet.xp);
//   pet.mood = "happy";
//   pet.lastUpdated = Date.now();

//   await savePetState(pet);
//   return pet;
// }

// // --- GET PET STATE ---
// export async function getPetState() {
//   let pet = await loadPetState();
//   pet = applyDecay(pet);
//   await savePetState(pet);
//   return pet;
// }

// // --- RESET PET ---
// export async function resetPet() {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
//   return { ...defaultPet };
// }