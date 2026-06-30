import React from 'react';
import { motion } from 'framer-motion';
import GuestShell from '../components/GuestShell';
import ZoneCard from '../components/ZoneCard';
import { salonZones } from '../data/salonZones';

const ExplorePage = () => (
  <GuestShell showBack backTo="/teqdimat">
    <div className="px-4 py-6 pres-safe-bottom space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Salonu kəşf edin</h1>
        <p className="text-sm text-white/50 mt-1">
          Hər zonanı gəzin, atmosferi hiss edin, masanızı seçin
        </p>
      </motion.div>

      <div className="space-y-4">
        {salonZones.map((zone, i) => (
          <ZoneCard key={zone.id} zone={zone} index={i} />
        ))}
      </div>
    </div>
  </GuestShell>
);

export default ExplorePage;
