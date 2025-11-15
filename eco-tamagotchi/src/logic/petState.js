// src/state/petState.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ECO_PET_STATE";

// --- DEFAULT PET STATE ---
const defaultPet = {
  mood: "neutral",          // "happy", "sad", "neutral"
  xp: 0,
  level: 1,
  lastUpdated: Date.now(),  // timestamp for decay logic
};

// --- LOAD PET STATE FROM STORAGE ---
export async function loadPetState() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
    return { ...defaultPet };
  } catch (err) {
    console.log("Error loading pet:", err);
    return { ...defaultPet };
  }
}

// --- SAVE PET STATE ----
async function savePetState(pet) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

// --- DECAY LOGIC (PET GETS SAD IF INACTIVE) ---
function applyDecay(pet) {
  const now = Date.now();
  const hoursPassed = Math.floor((now - pet.lastUpdated) / (1000 * 60 * 60));

  if (hoursPassed > 0) {
    pet.mood = "sad";      // simple decay system
    pet.xp = Math.max(0, pet.xp - hoursPassed * 2);
    pet.lastUpdated = now;
  }

  return pet;
}

// --- LEVEL-UP LOGIC ---
function computeLevel(xp) {
  if (xp < 20) return 1;
  if (xp < 50) return 2;
  if (xp < 100) return 3;
  return 4;
}

// --- LOGGING ACTIONS (UI CALLS THIS) ---
export async function logAction(actionType) {
  let pet = await loadPetState();
  pet = applyDecay(pet);

  // XP rewards per action
  const xpRewards = {
    recycle: 5,
    walk: 8,
    energySave: 4,
  };

  pet.xp += xpRewards[actionType] || 3;
  pet.level = computeLevel(pet.xp);
  pet.mood = "happy";
  pet.lastUpdated = Date.now();

  await savePetState(pet);
  return pet;
}

// --- GET PET (WITH DECAY APPLIED) ---
export async function getPetState() {
  let pet = await loadPetState();
  pet = applyDecay(pet);
  await savePetState(pet);
  return pet;
}

// --- RESET PET ---
export async function resetPet() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPet));
  return { ...defaultPet };
}
