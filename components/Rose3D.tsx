
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Petal = ({ rotation, position, scale, color, offset }: { rotation: THREE.Euler, position: THREE.Vector3, scale: number, color: string, offset: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle organic waving
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = rotation.x + Math.sin(t + offset) * 0.05;
      meshRef.current.rotation.z = rotation.z + Math.cos(t * 0.5 + offset) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} rotation={rotation} position={position} scale={[scale, scale * 1.5, scale]}>
      <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.8} 
        metalness={0.1} 
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};

const Rose3D: React.FC = () => {
  const roseGroup = useRef<THREE.Group>(null);

  const petals = useMemo(() => {
    const p = [];
    const petalCount = 45;
    const phi = (Math.sqrt(5) + 1) / 2; // Golden ratio for placement

    for (let i = 0; i < petalCount; i++) {
      const t = i / (petalCount - 1);
      const angle = 2 * Math.PI * phi * i;
      const radius = Math.pow(t, 0.5) * 1.5;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = t * 1.2;

      // Color shifts from deep red core to lighter rose outer
      const r = 180 + t * 75;
      const g = 20 + t * 40;
      const b = 40 + t * 60;
      const color = `rgb(${r}, ${g}, ${b})`;

      // Rotation to make petals face inwards/upwards
      const rotation = new THREE.Euler(
        -Math.PI / 4 - t * Math.PI / 3, // Tilt inward
        -angle,
        0
      );

      p.push({
        id: i,
        position: new THREE.Vector3(x, y - 1, z),
        rotation,
        scale: 0.3 + (1 - t) * 0.7,
        color,
        offset: i * 0.1
      });
    }
    return p;
  }, []);

  useFrame((state) => {
    if (roseGroup.current) {
      roseGroup.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={roseGroup}>
      {/* Stem */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 4, 16]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </mesh>
      
      {/* Rose Head */}
      <group position={[0, -0.5, 0]}>
        {petals.map((p) => (
          <Petal key={p.id} {...p} />
        ))}
        {/* Core center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#8b0000" />
        </mesh>
      </group>

      {/* Leaves */}
      <mesh position={[0.3, -1.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.1]} />
        <meshStandardMaterial color="#3a6b35" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.3, -2.5, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.1]} />
        <meshStandardMaterial color="#3a6b35" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default Rose3D;
