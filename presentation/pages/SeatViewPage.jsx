import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Restaurant3DExperience from '../components/three/Restaurant3DExperience';
import { useApp } from '../../src/context/AppContext';

const SeatViewPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { tables } = useApp();
  const table = tables.find((t) => t.id === tableId);

  if (!table) {
    navigate('/teqdimat/3d');
    return null;
  }

  return (
    <Restaurant3DExperience
      initialFloorId={table.floorId}
      autoSeatTableId={tableId}
    />
  );
};

export default SeatViewPage;
