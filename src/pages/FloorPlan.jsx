import React, { useState, useRef } from 'react';
import { Plus, Save, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Table from '../components/floorplan/Table';
import TablePropertiesPanel from '../components/floorplan/TablePropertiesPanel';
import { useApp } from '../context/AppContext';
import { generateTableId } from '../utils/helpers';
import { TABLE_STATUS, TABLE_SHAPES } from '../utils/constants';
import toast from 'react-hot-toast';

const ZONES = ['Pəncərə', 'Əsas Salon', 'VIP', 'Terras', 'Bar'];

const FloorPlan = () => {
  const { tables, setTables } = useApp();
  const [selectedTable, setSelectedTable] = useState(null);
  const [draggedTable, setDraggedTable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [activeZone, setActiveZone] = useState('all');
  const canvasRef = useRef(null);

  const filteredTables = activeZone === 'all' ? tables : tables.filter(t => t.zone === activeZone);

  const handleAddTable = () => {
    const newTable = {
      id: generateTableId(),
      number: `${tables.length + 1}`,
      capacity: 4,
      shape: TABLE_SHAPES.SQUARE,
      status: TABLE_STATUS.AVAILABLE,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: 0,
      zone: activeZone === 'all' ? 'Əsas Salon' : activeZone,
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable);
    toast.success('Masa əlavə edildi!');
  };

  const handleUpdateTable = (updatedTable) => {
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
    setSelectedTable(updatedTable);
    toast.success('Masa yeniləndi!');
  };

  const handleDeleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
    setSelectedTable(null);
    toast.success('Masa silindi!');
  };

  const handleDragStart = (e, table) => {
    setDraggedTable(table);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => setDraggedTable(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedTable) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setTables(tables.map(t => t.id === draggedTable.id ? { ...t, x, y } : t));
  };

  const statusLegend = [
    { label: 'Boş', color: 'bg-emerald-500' },
    { label: 'Dolu', color: 'bg-rose-500' },
    { label: 'Rezerv', color: 'bg-amber-500' },
    { label: 'Təmizlənir', color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Masa Planı"
        subtitle="Restoranın masa yerləşməsini real-time idarə edin"
        action={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="small" icon={<ZoomOut size={16} />} onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} />
            <Button variant="outline" size="small" icon={<ZoomIn size={16} />} onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} />
            <Button variant="outline" size="small" icon={<Maximize2 size={16} />} onClick={() => setZoom(1)} />
            <Button variant="secondary" size="small" icon={<Plus size={16} />} onClick={handleAddTable}>Masa Əlavə Et</Button>
            <Button variant="primary" size="small" icon={<Save size={16} />} onClick={() => toast.success('Masa planı yadda saxlanıldı!')}>Yadda Saxla</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveZone('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeZone === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Hamısı ({tables.length})
        </button>
        {ZONES.map(zone => {
          const count = tables.filter(t => t.zone === zone).length;
          return (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeZone === zone ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {zone} ({count})
            </button>
          );
        })}
      </div>

      <Card premium delay={0.1}>
        <div className="flex items-center gap-6 flex-wrap">
          {statusLegend.map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 ${s.color} rounded-full`} />
              <span className="text-xs font-medium text-slate-600">{s.label}</span>
            </div>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-medium">Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </Card>

      <Card premium padding={false} delay={0.15}>
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-b-2xl"
          style={{ width: '100%', height: '580px', overflow: 'auto', cursor: draggedTable ? 'grabbing' : 'default' }}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', width: '900px', height: '600px', position: 'relative' }}>
            <div className="absolute inset-0 opacity-[0.15]" style={{
              backgroundImage: 'linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

            {ZONES.map((zone, i) => {
              const zoneTables = tables.filter(t => t.zone === zone);
              if (zoneTables.length === 0) return null;
              const minX = Math.min(...zoneTables.map(t => t.x)) - 20;
              const minY = Math.min(...zoneTables.map(t => t.y)) - 30;
              return (
                <div
                  key={zone}
                  className="absolute px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/60 backdrop-blur rounded-md"
                  style={{ left: minX, top: minY - 10 }}
                >
                  {zone}
                </div>
              );
            })}

            {filteredTables.map((table) => (
              <Table
                key={table.id}
                table={table}
                isSelected={selectedTable?.id === table.id}
                onClick={setSelectedTable}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      </Card>

      {selectedTable && (
        <TablePropertiesPanel
          table={selectedTable}
          onUpdate={handleUpdateTable}
          onDelete={handleDeleteTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
};

export default FloorPlan;
