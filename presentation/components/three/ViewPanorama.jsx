import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getTableView } from '../../data/tableViews';
import { getSeatCameraConfig } from '../../utils/table3dLayout';

const ViewPanorama = ({ table, timeMode, visible, opacity = 1 }) => {
  const meshRef = useRef();
  const view = getTableView(table);
  const cfg = getSeatCameraConfig(table);
  const url = timeMode === 'evening' ? view.evening : view.day;
  const texture = useTexture(url);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = cfg.panoramaPos[1] + Math.sin(t * 0.4) * 0.05;
    meshRef.current.material.opacity = THREE.MathUtils.lerp(
      meshRef.current.material.opacity,
      opacity,
      0.06,
    );
  });

  if (!visible) return null;

  const [w, h] = cfg.panoramaSize || [20, 12];

  return (
    <group position={cfg.panoramaPos} rotation={cfg.panoramaRot}>
      <mesh ref={meshRef}>
        <planeGeometry args={[w, h, 32, 16]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Curved immersive backdrop */}
      <mesh position={[0, 0, -0.5]}>
        <cylinderGeometry args={[w * 0.55, w * 0.55, h, 48, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} transparent opacity={opacity * 0.85} />
      </mesh>
      {/* Golden frame glow */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[w + 0.3, h + 0.3]} />
        <meshBasicMaterial color="#d4a853" transparent opacity={opacity * 0.08} />
      </mesh>
    </group>
  );
};

export default ViewPanorama;
