import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import TableMesh from './TableMesh';
import ViewPanorama from './ViewPanorama';
import { tableToPosition3D, getSeatCameraConfig, floorAccent } from '../../utils/table3dLayout';

const sceneThemes = {
  day: {
    bg: '#87a8c4',
    fog: '#a8c4d8',
    ambient: 0.45,
    directional: 1.2,
    windowEmissive: 0.35,
    stars: false,
    spotColor: '#fff8e7',
    spotIntensity: 0.35,
  },
  evening: {
    bg: '#050807',
    fog: '#050807',
    ambient: 0.18,
    directional: 0.45,
    windowEmissive: 0.85,
    stars: true,
    spotColor: '#d4a853',
    spotIntensity: 0.75,
  },
};

const RestaurantScene = ({
  tables, floorId, phase, selectedTable, timeMode, onTableSelect, controlsRef, animProgress,
}) => {
  const floorTables = tables.filter((t) => t.floorId === floorId);
  const accent = floorAccent[floorId] || '#1a2e1f';
  const theme = sceneThemes[timeMode] || sceneThemes.evening;
  const isSeat = phase === 'seatview' || phase === 'transitioning';

  return (
    <>
      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.fog, 18, 45]} />
      {theme.stars && <Stars radius={80} depth={40} count={1800} factor={4} saturation={0} fade speed={0.8} />}

      <ambientLight intensity={isSeat ? theme.ambient * 0.5 : theme.ambient} />
      <directionalLight
        position={timeMode === 'day' ? [10, 18, 8] : [8, 14, 6]}
        intensity={isSeat ? theme.directional * 0.5 : theme.directional}
        color={timeMode === 'day' ? '#fff8f0' : '#ffffff'}
        castShadow shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, 6, -4]} intensity={timeMode === 'day' ? 0.3 : 0.55} color="#4ade80" />
      <spotLight
        position={[0, 12, 0]} angle={0.5} penumbra={0.8}
        intensity={isSeat ? theme.spotIntensity * 0.4 : theme.spotIntensity}
        color={theme.spotColor}
      />
      {timeMode === 'evening' && (
        <>
          <pointLight position={[0, 4, -8]} intensity={0.6} color="#60a5fa" distance={20} />
          <pointLight position={[-8, 3, 0]} intensity={0.4} color="#4ade80" distance={15} />
          <pointLight position={[8, 3, 0]} intensity={0.4} color="#fbbf24" distance={15} />
        </>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial color={accent} roughness={0.85} metalness={timeMode === 'evening' ? 0.15 : 0.08} />
      </mesh>

      <gridHelper args={[24, 24, timeMode === 'day' ? '#4a6050' : '#2a4030', timeMode === 'day' ? '#3a5040' : '#1a2820']} position={[0, 0.01, 0]} />

      <mesh position={[0, 3, -9]} receiveShadow>
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial
          color={timeMode === 'day' ? '#87ceeb' : '#0a1520'}
          emissive={timeMode === 'day' ? '#4a90c2' : '#1a3050'}
          emissiveIntensity={isSeat ? theme.windowEmissive * 1.2 : theme.windowEmissive}
          transparent opacity={timeMode === 'day' ? 0.95 : 0.9}
        />
      </mesh>

      {[[-12, 0, 0, Math.PI / 2], [12, 0, 0, -Math.PI / 2]].map(([x, y, z, ry], i) => (
        <mesh key={i} position={[x, y + 2.5, z]} rotation={[0, ry, 0]}>
          <planeGeometry args={[18, 6]} />
          <meshStandardMaterial color={timeMode === 'day' ? '#1a2820' : '#0f1812'} roughness={0.9} />
        </mesh>
      ))}

      {[[-8, -4], [8, -3], [-6, 4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.15, 0.2, 0.8, 8]} /><meshStandardMaterial color="#3d2810" /></mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#2d5a30" emissive="#1a4020" emissiveIntensity={timeMode === 'evening' ? 0.35 : 0.15} />
          </mesh>
        </group>
      ))}

      {phase !== 'seatview' && floorTables.map((table) => (
        <TableMesh
          key={table.id}
          table={table}
          position={tableToPosition3D(table)}
          selected={selectedTable?.id === table.id}
          onSelect={onTableSelect}
          disabled={phase === 'transitioning'}
          timeMode={timeMode}
        />
      ))}

      {selectedTable && (phase === 'transitioning' || phase === 'seatview') && (
        <ViewPanorama
          table={selectedTable}
          timeMode={timeMode}
          visible={animProgress > 0.35}
          opacity={Math.min(1, (animProgress - 0.35) / 0.45)}
        />
      )}

      {phase === 'seatview' && selectedTable && <SeatTableSilhouette table={selectedTable} />}

      <ContactShadows position={[0, 0, 0]} opacity={timeMode === 'day' ? 0.35 : 0.5} scale={24} blur={2.5} far={12} />

      {phase === 'browse' && (
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={22}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </>
  );
};

function SeatTableSilhouette({ table }) {
  const pos = tableToPosition3D(table);
  return (
    <group position={[pos.x, 0, pos.z]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.12, 24]} />
        <meshStandardMaterial color="#1a2e1f" emissive="#4ade80" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function CameraRig({ phase, selectedTable, animProgress, setAnimProgress }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (phase === 'transitioning') {
      const next = Math.min(1, animProgress + delta * 0.9);
      setAnimProgress(next);
      if (selectedTable) {
        const cfg = getSeatCameraConfig(selectedTable);
        const startPos = new THREE.Vector3(0, 11, 14);
        const endPos = new THREE.Vector3(...cfg.cameraPos);
        camera.position.lerpVectors(startPos, endPos, easeInOutCubic(next));
        const startLook = new THREE.Vector3(0, 0, 0);
        const endLook = new THREE.Vector3(...cfg.lookAt);
        lookTarget.current.lerpVectors(startLook, endLook, easeInOutCubic(next));
        camera.lookAt(lookTarget.current);
      }
    } else if (phase === 'seatview' && selectedTable) {
      const cfg = getSeatCameraConfig(selectedTable);
      camera.position.lerp(new THREE.Vector3(...cfg.cameraPos), 0.08);
      lookTarget.current.lerp(new THREE.Vector3(...cfg.lookAt), 0.08);
      camera.lookAt(lookTarget.current);
    } else if (phase === 'browse') {
      setAnimProgress(0);
      camera.position.lerp(new THREE.Vector3(0, 11, 14), 0.05);
      lookTarget.current.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      camera.lookAt(lookTarget.current);
    }
  });

  return null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

export default RestaurantScene;
