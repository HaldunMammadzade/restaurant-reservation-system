import React from 'react';
import { useNavigate } from 'react-router-dom';
import SeatCompare from '../components/SeatCompare';
import { usePresentation } from '../context/PresentationContext';

const ComparePage = () => {
  const navigate = useNavigate();
  const { selectedTable, compareTable, selectTable } = usePresentation();

  if (!selectedTable || !compareTable) {
    navigate('/teqdimat/explore');
    return null;
  }

  return (
    <div className="presentation-root">
      <SeatCompare
        tableA={selectedTable}
        tableB={compareTable}
        onSelect={(t) => {
          selectTable(t);
          navigate('/teqdimat/reserve');
        }}
        onBack={() => navigate(-1)}
      />
    </div>
  );
};

export default ComparePage;
