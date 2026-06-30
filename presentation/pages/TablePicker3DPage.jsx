import React from 'react';
import { useParams } from 'react-router-dom';
import Restaurant3DExperience from '../components/three/Restaurant3DExperience';

const TablePicker3DPage = () => {
  const { floorId, tableId } = useParams();
  return (
    <Restaurant3DExperience
      initialFloorId={floorId || 'floor_1'}
      autoSeatTableId={tableId || null}
    />
  );
};

export default TablePicker3DPage;
