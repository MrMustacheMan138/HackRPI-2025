import React, { useState } from "react";

const Tamagotchi: React.FC = () => {
  const [name, setName] = useState("Tama");
  const [hunger, setHunger] = useState(50); // 0 = full, 100 = starving
  const [happiness, setHappiness] = useState(50); // 0 = sad, 100 = happy

  const feed = () => {
    setHunger(prev => Math.max(prev - 10, 0));
    setHappiness(prev => Math.min(prev + 5, 100));
  };

  const play = () => {
    setHappiness(prev => Math.min(prev + 10, 100));
    setHunger(prev => Math.min(prev + 5, 100));
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <h1>{name} 🐾</h1>
      <div>
        <p>Hunger: {hunger}</p>
        <p>Happiness: {happiness}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={feed} style={{ marginRight: "10px" }}>
          🍎 Feed
        </button>
        <button onClick={play}>🎾 Play</button>
      </div>
    </div>
  );
};

export default Tamagotchi;
