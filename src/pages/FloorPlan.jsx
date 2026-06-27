import React, { useState, useRef, useMemo } from 'react';
import {
  Plus, Save, ZoomIn, ZoomOut, Maximize2, Layers, Users, Clock,
  ArrowRight, Eye, LayoutGrid, Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Table from '../components/floorplan/Table';
import TablePropertiesPanel from '../components/floorplan/TablePropertiesPanel';
import { useApp } from '../context/AppContext';
import {
  TABLE_STATUS, TABLE_SHAPES, SERVICE_PHASE_LABELS, SERVICE_PHASE_COLORS,
} from '../utils/constants';
import { getEstimatedTurnTime } from '../utils/bookingHelpers';

const FloorPlan = () => {
  const {
    floors, tables, waitlist, staff, restaurant, upcomingEvents, automations, smsLogs,
    getFloorStats, createTable, updateTable, deleteTable, saveTableLayout,
    advanceServicePhase, clearTable, seatFromWaitlist,
    mergeTables, unmergeTable, assignServerToTable,
  } = useApp();

  const [activeFloor, setActiveFloor] = useState(floors[0]?.id || 'floor_g');
  const [selectedTable, setSelectedTable] = useState(null);
  const [draggedTable, setDraggedTable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('map');
  const [localTables, setLocalTables] = useState(null);
  const canvasRef = useRef(null);

  const displayTables = localTables || tables;
  const floorTables = displayTables.filter((t) => t.floorId === activeFloor);
  const activeFloorData = floors.find((f) => f.id === activeFloor);
  const stats = getFloorStats(activeFloor);

  const occupiedOnFloor = useMemo(() =>
    floorTables.filter((t) => t.status === TABLE_STATUS.OCCUPIED)
      .sort((a, b) => (a.seatedAt || 0) - (b.seatedAt || 0)),
  [floorTables]);

  const handleAddTable = () => {
    const count = floorTables.length + 1;
    createTable({
      number: `${activeFloorData?.shortName || 'T'}${count}`,
      capacity: 4,
      shape: TABLE_SHAPES.SQUARE,
      zone: 'Əsas Salon',
      floorId: activeFloor,
      x: 80 + Math.random() * 300,
      y: 80 + Math.random() * 200,
    });
    toast.success('Masa əlavə edildi!');
  };

  const handleUpdateTable = (updatedTable) => {
    updateTable(updatedTable.id, {
      number: updatedTable.number,
      capacity: updatedTable.capacity,
      shape: updatedTable.shape,
      status: updatedTable.status,
      zone: updatedTable.zone,
      guestName: updatedTable.guestName,
      partySize: updatedTable.partySize,
      servicePhase: updatedTable.servicePhase,
      floorId: updatedTable.floorId,
      serverId: updatedTable.serverId,
    });
    setSelectedTable(updatedTable);
    toast.success('Masa yeniləndi!');
  };

  const handleDeleteTable = (tableId) => {
    deleteTable(tableId);
    setSelectedTable(null);
    toast.success('Masa silindi!');
  };

  const handleDragStart = (e, table) => { setDraggedTable(table); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragEnd = () => setDraggedTable(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedTable) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    const updated = displayTables.map((t) => (t.id === draggedTable.id ? { ...t, x, y } : t));
    setLocalTables(updated);
  };

  const handleSaveLayout = () => {
    const positions = (localTables || tables).map((t) => ({ id: t.id, x: t.x, y: t.y, rotation: t.rotation || 0 }));
    saveTableLayout(positions);
    setLocalTables(null);
    toast.success('Masa planı yadda saxlanıldı!');
  };

  const statusLegend = [
    { label: 'Boş', color: 'bg-emerald-500' }, { label: 'Dolu', color: 'bg-rose-500' },
    { label: 'Rezerv', color: 'bg-amber-500' }, { label: 'Təmizlənir', color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Çoxmərtəbəli Masa Planı"
        subtitle={`${floors.length} mərtəbə · ${tables.length} masa · Real-time xidmət izləmə`}
        badge="Live"
        action={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="small" icon={<ZoomOut size={16} />} onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))} />
            <Button variant="outline" size="small" icon={<ZoomIn size={16} />} onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} />
            <Button variant="outline" size="small" icon={<Maximize2 size={16} />} onClick={() => setZoom(1)} />
            <Button variant={viewMode === 'map' ? 'primary' : 'outline'} size="small" icon={<LayoutGrid size={16} />} onClick={() => setViewMode('map')}>Xəritə</Button>
            <Button variant={viewMode === 'live' ? 'primary' : 'outline'} size="small" icon={<Eye size={16} />} onClick={() => setViewMode('live')}>Canlı</Button>
            <Button variant="secondary" size="small" icon={<Plus size={16} />} onClick={handleAddTable}>Masa Əlavə</Button>
            <Button variant="primary" size="small" icon={<Save size={16} />} onClick={handleSaveLayout}>Yadda Saxla</Button>
          </div>
        }
      />

      {/* Floor selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {floors.map((floor, i) => {
          const fs = getFloorStats(floor.id);
          const isActive = activeFloor === floor.id;
          return (
            <motion.button
              key={floor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setActiveFloor(floor.id); setSelectedTable(null); }}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all border-2 ${
                isActive ? 'border-white shadow-premium-lg scale-[1.02]' : 'border-transparent opacity-90 hover:opacity-100'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${floor.color}`} />
              <div className="relative text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{floor.icon}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${fs.rate > 80 ? 'bg-rose-500/80' : 'bg-white/20'}`}>
                    {fs.rate}%
                  </span>
                </div>
                <h3 className="font-bold text-sm">{floor.name}</h3>
                <p className="text-[10px] text-white/70 mt-0.5">{floor.description}</p>
                <div className="flex gap-3 mt-2 text-[10px] font-semibold">
                  <span>{fs.occupied} dolu</span>
                  <span>{fs.available} boş</span>
                  <span>{fs.total} cəmi</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/90 rounded-full transition-all" style={{ width: `${fs.rate}%` }} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 space-y-4">
          {viewMode === 'map' ? (
            <Card premium flush delay={0.1}>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-4 flex-wrap text-xs text-slate-600">
                {statusLegend.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 ${s.color} rounded-full`} />
                    {s.label}
                  </div>
                ))}
                <span className="ml-auto text-slate-500">{activeFloorData?.name} · Zoom {Math.round(zoom * 100)}%</span>
              </div>
              <div ref={canvasRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                className="relative bg-slate-100"
                style={{ width: '100%', height: '480px', overflow: 'auto', cursor: draggedTable ? 'grabbing' : 'default' }}>
                <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', width: '900px', height: '560px', position: 'relative' }}>
                  <div className="absolute inset-0 opacity-[0.12]" style={{
                    backgroundImage: 'linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/80 backdrop-blur rounded-xl text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                    <Layers size={12} /> {activeFloorData?.name}
                  </div>
                  {floorTables.map((table) => (
                    <Table key={table.id} table={table} isSelected={selectedTable?.id === table.id}
                      onClick={setSelectedTable} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {occupiedOnFloor.length === 0 ? (
                <Card premium><p className="text-center text-slate-500 py-8">Bu mərtəbədə dolu masa yoxdur</p></Card>
              ) : occupiedOnFloor.map((table, i) => {
                const mins = table.seatedAt ? Math.floor((Date.now() - table.seatedAt) / 60000) : 0;
                const turn = getEstimatedTurnTime(table, restaurant?.settings?.reservationDuration || 90);
                const server = staff.find((s) => s.id === table.serverId);
                return (
                  <motion.div key={table.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="card-premium flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: SERVICE_PHASE_COLORS[table.servicePhase] || '#6366F1' }}>
                      {table.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{table.guestName || 'Qonaq'}</h4>
                        <span className="text-xs text-slate-400">· {table.partySize} nəfər</span>
                        {server && <span className="text-[10px] text-primary-600">· {server.name.split(' ')[0]}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                          style={{ backgroundColor: SERVICE_PHASE_COLORS[table.servicePhase] }}>
                          {SERVICE_PHASE_LABELS[table.servicePhase] || 'Oturub'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{mins} dəq</span>
                        {turn && turn.remaining <= 15 && turn.remaining > 0 && (
                          <span className="text-[10px] text-amber-600 font-bold">~{turn.remaining} dəq qalıb</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => advanceServicePhase(table.id)}>
                        Növbəti <ArrowRight size={14} />
                      </Button>
                      <Button size="small" variant="outline" onClick={() => clearTable(table.id)}>Boşalt</Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card premium>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Users size={16} /> Gözləmə ({waitlist.length})</h3>
            {waitlist.length === 0 ? (
              <p className="text-xs text-slate-400">Gözləmə siyahısı boşdur</p>
            ) : waitlist.slice(0, 4).map((w) => {
              const avail = floorTables.find((t) => t.status === TABLE_STATUS.AVAILABLE && t.capacity >= w.partySize);
              return (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{w.customerName}</p>
                    <p className="text-[10px] text-slate-400">{w.partySize} nəfər · {w.priority === 'vip' ? '⭐ VIP' : w.priority}</p>
                  </div>
                  {avail && (
                    <button onClick={() => { seatFromWaitlist(w.id, avail.id); toast.success(`${w.customerName} → Masa ${avail.number}`); }}
                      className="text-[10px] font-bold text-primary-600 hover:bg-primary-50 px-2 py-1 rounded-lg">
                      Masa {avail.number}
                    </button>
                  )}
                </div>
              );
            })}
          </Card>

          <Card premium>
            <h3 className="font-bold text-slate-800 mb-3">Xidmət Fazaları</h3>
            <div className="space-y-2">
              {Object.entries(SERVICE_PHASE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SERVICE_PHASE_COLORS[key] }} />
                  <span className="text-xs text-slate-600">{label}</span>
                  <span className="ml-auto text-xs font-bold text-slate-400">
                    {floorTables.filter((t) => t.servicePhase === key).length}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card premium>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Info size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-700">Bu gecə</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {stats.rate > 85
                    ? `${activeFloorData?.name} dolu — gözləmə siyahısından yönləndirin.`
                    : `${activeFloorData?.name} — ${stats.available} boş masa var.`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {selectedTable && (
          <TablePropertiesPanel
            table={selectedTable}
            floors={floors}
            staff={staff.filter((s) => s.status === 'active')}
            mergeCandidates={floorTables.filter((t) => t.id !== selectedTable.id && t.status === TABLE_STATUS.AVAILABLE && !t.mergedInto)}
            onUpdate={handleUpdateTable}
            onDelete={handleDeleteTable}
            onAdvancePhase={() => advanceServicePhase(selectedTable.id)}
            onClear={() => { clearTable(selectedTable.id); setSelectedTable(null); toast.success('Masa boşaldıldı'); }}
            onMerge={(secondaryId) => { mergeTables(selectedTable.id, secondaryId); toast.success('Masalar birləşdirildi'); }}
            onUnmerge={() => { unmergeTable(selectedTable.id); toast.success('Birləşmə ləğv edildi'); }}
            onAssignServer={(staffId) => { assignServerToTable(selectedTable.id, staffId); toast.success('Ofisiant təyin edildi'); }}
            onClose={() => setSelectedTable(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloorPlan;
