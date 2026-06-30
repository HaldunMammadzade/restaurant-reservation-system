import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { TABLE_STATUS } from '../../../src/utils/constants';

const statusConfig = {
  [TABLE_STATUS.AVAILABLE]: { color: '#4ade80', emissive: '#22c55e', intensity: 0.55, pulse: true },
  [TABLE_STATUS.OCCUPIED]: { color: '#f87171', emissive: '#ef4444', intensity: 0.7, pulse: false },
  [TABLE_STATUS.RESERVED]: { color: '#fbbf24', emissive: '#f59e0b', intensity: 0.65, pulse: true },
  [TABLE_STATUS.CLEANING]: { color: '#94a3b8', emissive: '#64748b', intensity: 0.35, pulse: true },
  [TABLE_STATUS.MAINTENANCE]: { color: '#a78bfa', emissive: '#8b5cf6', intensity: 0.5, pulse: false },
};

const TableMesh = ({
  table, position, selected, onSelect, disabled, timeMode = 'day',
}) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isRound = table.shape === 'round' || table.capacity <= 2;
  const cfg = statusConfig[table.status] || statusConfig[TABLE_STATUS.AVAILABLE];
  const canClick = table.status === TABLE_STATUS.AVAILABLE && !disabled;
  const nightFactor = timeMode === 'evening' ? 1.4 : 1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    if (selected) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.35, 0.08);
      groupRef.current.rotation.y = t * 0.5;
    } else if (hovered && canClick) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.15, 0.1);
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    }
    if (meshRef.current) {
      const targetScale = selected ? 1.15 : hovered && canClick ? 1.08 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (lightRef.current && cfg.pulse) {
      lightRef.current.intensity = (cfg.intensity * nightFactor) * (0.7 + Math.sin(t * 2.5) * 0.3);
    }
  });

  return (
    <group position={[position.x, 0, position.z]} ref={groupRef}>
      {(hovered || selected || table.status !== TABLE_STATUS.AVAILABLE) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[isRound ? 0.85 : 1, isRound ? 1.2 : 1.4, 32]} />
          <meshBasicMaterial color={cfg.color} transparent opacity={selected ? 0.55 : hovered ? 0.35 : 0.2} />
        </mesh>
      )}

      <Float speed={selected ? 4 : 1.5} rotationIntensity={0} floatIntensity={selected ? 0.4 : 0.08}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); if (canClick) onSelect(table); }}
          onPointerOver={(e) => { e.stopPropagation(); if (canClick) { setHovered(true); document.body.style.cursor = 'pointer'; } }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          castShadow receiveShadow
        >
          {isRound ? (
            <cylinderGeometry args={[0.55, 0.6, 0.12, 24]} />
          ) : (
            <boxGeometry args={[1, 0.12, table.capacity >= 6 ? 1.4 : 1]} />
          )}
          <meshStandardMaterial
            color={selected ? '#4ade80' : hovered && canClick ? '#6ee7a0' : '#2d4a35'}
            emissive={cfg.emissive}
            emissiveIntensity={selected ? 0.9 : hovered && canClick ? 0.5 : cfg.intensity * 0.4}
            metalness={0.35}
            roughness={0.38}
          />
        </mesh>
      </Float>

      {[0, 1, 2, 3].slice(0, Math.min(table.capacity, 4)).map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const cx = Math.cos(angle) * (isRound ? 0.95 : 0.85);
        const cz = Math.sin(angle) * (isRound ? 0.95 : 0.75);
        return (
          <mesh key={i} position={[cx, 0.22, cz]} castShadow>
            <boxGeometry args={[0.22, 0.44, 0.22]} />
            <meshStandardMaterial color="#1e2e24" roughness={0.8} />
          </mesh>
        );
      })}

      <Text position={[0, 0.55, 0]} fontSize={0.26} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#000000">
        {table.number}
      </Text>

      <pointLight
        ref={lightRef}
        position={[0, 0.9, 0]}
        intensity={cfg.intensity * nightFactor}
        color={cfg.color}
        distance={2.5}
        decay={2}
      />
    </group>
  );
};

export default TableMesh;
