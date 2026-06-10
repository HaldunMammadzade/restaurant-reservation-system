import React from 'react';
import { TABLE_STATUS_COLORS, TABLE_SHAPES } from '../../utils/constants';

const Table = ({ table, isSelected, onClick, onDragStart, onDragEnd }) => {
  const getShapeStyles = () => {
    const baseStyles = 'cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-110';
    switch (table.shape) {
      case TABLE_SHAPES.ROUND: return `${baseStyles} rounded-full`;
      case TABLE_SHAPES.SQUARE: return `${baseStyles} rounded-xl`;
      case TABLE_SHAPES.RECTANGLE: return `${baseStyles} rounded-xl`;
      default: return `${baseStyles} rounded-xl`;
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, table)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(table)}
      className={`${getShapeStyles()} ${isSelected ? 'ring-[3px] ring-primary-500 ring-offset-2 z-10' : ''}`}
      style={{
        position: 'absolute',
        left: table.x,
        top: table.y,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        transform: `rotate(${table.rotation}deg)`,
        boxShadow: isSelected
          ? '0 12px 28px rgba(99, 102, 241, 0.35)'
          : '0 4px 12px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-white select-none">
        <div className="text-base font-bold leading-none">{table.number}</div>
        <div className="text-[9px] mt-0.5 opacity-90 font-medium">{table.capacity} nəfər</div>
      </div>
    </div>
  );
};

export default Table;
