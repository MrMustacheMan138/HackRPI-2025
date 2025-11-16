// src/utils/sounds.js
import { Audio } from 'expo-av';

// Sound objects cache
const sounds = {};

// Load and play a sound
export async function playSound(soundName) {
  try {
    // If sound is already loaded, play it
    if (sounds[soundName]) {
      await sounds[soundName].replayAsync();
      return;
    }

    // Load the sound first
    const soundMap = {
      levelUp: require('../../assets/sounds/level_up.mp3'), // Adjust filename if different
    };

    if (!soundMap[soundName]) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(soundMap[soundName]);
    sounds[soundName] = sound;
    await sound.playAsync();
  } catch (error) {
    console.log('Error playing sound:', error);
  }
}

// Clean up sounds when app closes
export async function unloadAllSounds() {
  for (const soundName in sounds) {
    if (sounds[soundName]) {
      await sounds[soundName].unloadAsync();
    }
  }
}