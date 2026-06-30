import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ZoneCard = ({ zone, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
  >
    <Link to={`/teqdimat/explore/${zone.id}`} className="block group">
      <div className="relative h-48 rounded-3xl overflow-hidden">
        <img
          src={zone.heroImage}
          alt={zone.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${zone.accent} opacity-60 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-2xl">{zone.icon}</span>
          <h3 className="text-lg font-bold text-white mt-1">{zone.name}</h3>
          <p className="text-xs text-white/70">{zone.subtitle}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1 flex-wrap">
              {zone.highlights.slice(0, 2).map((h) => (
                <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/90">{h}</span>
              ))}
            </div>
            <span className="flex items-center gap-0.5 text-xs text-emerald-300 font-medium group-hover:gap-1 transition-all">
              Kəşf et <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ZoneCard;
