import React from 'react';
import { TABLE_STATUS_COLORS, TABLE_SHAPES, SERVICE_PHASE_COLORS } from '../../utils/constants';

const Table = ({ table, isSelected, onClick, onDragStart, onDragEnd }) => {
  const getShapeStyles = () => {
    const base = 'cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-110';
    switch (table.shape) {
      case TABLE_SHAPES.ROUND: return `${base} rounded-full`;
      case TABLE_SHAPES.RECTANGLE: return `${base} rounded-xl`;
      default: return `${base} rounded-xl`;
    }
  };

  const getSize = () => {
    if (table.capacity <= 2) return { width: 56, height: 56 };
    if (table.capacity <= 4) return { width: 72, height: 72 };
    if (table.capacity <= 6) return { width: 88, height: table.shape === TABLE_SHAPES.RECTANGLE ? 56 : 88 };
    return { width: 104, height: table.shape === TABLE_SHAPES.RECTANGLE ? 64 : 104 };
  };

  const size = getSize();
  const color = TABLE_STATUS_COLORS[table.status];
  const phaseColor = table.servicePhase ? SERVICE_PHASE_COLORS[table.servicePhase] : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, table)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(table)}
      className={`${getShapeStyles()} ${isSelected ? 'ring-[3px] ring-primary-500 ring-offset-2 z-10' : ''} ${table.vip ? 'ring-2 ring-amber-400/60' : ''}`}
      style={{
        position: 'absolute',
        left: table.x,
        top: table.y,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        transform: `rotate(${table.rotation || 0}deg)`,
        boxShadow: isSelected
          ? '0 12px 28px rgba(99, 102, 241, 0.35)'
          : '0 4px 12px rgba(0, 0, 0, 0.12)',
      }}
    >
      {phaseColor && table.status === 'occupied' && (
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: phaseColor }} />
      )}
      <div className="w-full h-full flex flex-col items-center justify-center text-white select-none px-1">
        <div className="text-base font-bold leading-none">{table.number}</div>
        <div className="text-[9px] mt-0.5 opacity-90 font-medium">{table.capacity} nəfər</div>
        {table.guestName && (
          <div className="text-[8px] mt-0.5 opacity-80 truncate max-w-full">{table.guestName.split(' ')[0]}</div>
        )}
      </div>
    </div>
  );
};

export default Table;
