import AsyncStorage from "@react-native-async-storage/async-storage";

import { 
  initialEcoStats, 
  applyEcoAction 
} from "./impact_model";

import { 
  getPersonalityMessage 
} from "./personality";

import { 
  getStageForLevel 
} from "./evolutions";

const STORAGE_KEY = "ECO_PET_STATE";

// --- DEFAULT PET STATE ---
const defaultPet = {
  mood: "neutral",
  xp: 0,
  level: 1,
  ecoStats: initialEcoStats,
  lastActionId: null,
  lastUpdated: Date.now(),
  message: "Hi! I'm your eco-pet 🌱",
  stage: getStageForLevel(1),
};

// --- LOAD PET STATE ---
export async function loadPetState() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return { ...defaultPet };

    const parsed = JSON.parse(data);

    // merge new fields with existing saved state
    return { ...defaultPet, ...parsed };
  } catch (err) {
    console.log("Error loading pet:", err);
    return { ...defaultPet };
  }
}

// --- SAVE PET STATE ---
async function savePetState(pet) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

// --- DECAY LOGIC ---
function applyDecay(pet) {
  const now = Date.now();
  const hoursPassed = Math.floor((now - pet.lastUpdated) / (1000 * 60 * 60));

  if (hoursPassed > 0) {
    pet.mood = "sad";
    pet.xp = Math.max(0, pet.xp - hoursPassed * 2);
    pet.lastUpdated = now;
  }

  return pet;
}

// --- LEVELING ---
function computeLevel(xp) {
  if (xp < 20) return 1;
  if (xp < 50) return 2;
  if (xp < 100) return 3;
  return 4;
}

// --- LOG ECO ACTION ---
export async function logAction(actionId) {
  let pet = await loadPetState();
  pet = applyDecay(pet);

  // 1. Apply eco impact (YOUR MODEL)
  pet.ecoStats = applyEcoAction(pet.ecoStats || initialEcoStats, actionId);

  // 2. XP gain based on eco action
  pet.xp += 10;

  // 3. Update level
  pet.level = computeLevel(pet.xp);

  // 4. Update pet evolution stage (YOUR MODEL)
  pet.stage = getStageForLevel(pet.level);

  // 5. Personality message (YOUR MODEL)
  pet.message = getPersonalityMessage(pet, pet.ecoStats, actionId);

  // 6. Mood & timestamp
  pet.mood = "happy";
  pet.lastActionId = actionId;
  pet.lastUpdated = Date.now();

  await savePetState(pet);
  return pet;
}

// --- GET PET STATE ---
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