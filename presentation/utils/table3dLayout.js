import { getTableView } from '../data/tableViews';

export const FLOOR_BOUNDS = { w: 520, h: 360 };

export const tableToPosition3D = (table) => ({
  x: (table.x / FLOOR_BOUNDS.w) * 14 - 7,
  z: (table.y / FLOOR_BOUNDS.h) * 10 - 5,
});

const seatConfigs = {
  window: (pos) => ({
    cameraPos: [pos.x, 1.42, pos.z + 0.75],
    lookAt: [pos.x, 1.55, pos.z - 14],
    panoramaPos: [pos.x, 3, pos.z - 9],
    panoramaRot: [0, 0, 0],
    panoramaSize: [22, 14],
  }),
  terrace: (pos) => ({
    cameraPos: [pos.x - 0.7, 1.42, pos.z],
    lookAt: [pos.x - 14, 2, pos.z + 1],
    panoramaPos: [pos.x - 8, 3.5, pos.z],
    panoramaRot: [0, Math.PI / 2, 0],
    panoramaSize: [24, 14],
  }),
  garden: (pos) => ({
    cameraPos: [pos.x, 1.42, pos.z + 0.7],
    lookAt: [pos.x, 1.8, pos.z - 12],
    panoramaPos: [pos.x, 3, pos.z - 8],
    panoramaRot: [0, 0, 0],
    panoramaSize: [22, 13],
  }),
  interior: (pos) => ({
    cameraPos: [pos.x, 1.42, pos.z + 0.65],
    lookAt: [pos.x, 1.6, pos.z - 6],
    panoramaPos: [pos.x, 2.8, pos.z - 4.5],
    panoramaRot: [0, 0, 0],
    panoramaSize: [18, 11],
  }),
  corner: (pos) => ({
    cameraPos: [pos.x + 0.5, 1.42, pos.z + 0.6],
    lookAt: [pos.x + 4, 1.5, pos.z - 3],
    panoramaPos: [pos.x + 2, 2.5, pos.z - 2],
    panoramaRot: [0, -Math.PI / 6, 0],
    panoramaSize: [14, 10],
  }),
  private: (pos) => ({
    cameraPos: [pos.x, 1.42, pos.z + 0.8],
    lookAt: [pos.x, 1.7, pos.z - 8],
    panoramaPos: [pos.x, 3.2, pos.z - 5],
    panoramaRot: [0, 0, 0],
    panoramaSize: [20, 12],
  }),
};

export const getSeatCameraConfig = (table) => {
  const pos = tableToPosition3D(table);
  const { viewKey } = getTableView(table);
  const fn = seatConfigs[viewKey] || seatConfigs.interior;
  return { ...fn(pos), pos };
};

export const ORBIT_CAMERA = {
  position: [0, 11, 14],
  lookAt: [0, 0, 0],
};

export const floorAccent = {
  floor_g: '#1a2e1f',
  floor_1: '#2a2418',
  floor_t: '#142820',
  floor_v: '#2a2010',
};
