
import React, { useEffect, useState } from 'react';
import { PetalState } from '../types';

const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<PetalState[]>([]);

  useEffect(() => {
    const initialPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: 10 + Math.random() * 20,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPetals(initialPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.2}px`,
            backgroundColor: '#ff4d6d',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            opacity: 0.6,
            filter: 'blur(1px)',
            transform: `rotate(${petal.rotation}deg)`,
            animation: `fall ${petal.duration}s linear infinite ${petal.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FallingPetals;
