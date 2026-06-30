import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Box, Eye, Sparkles, ArrowRight, Play, Star } from 'lucide-react';
import GuestShell from '../components/GuestShell';
import { PRESENTATION_RESTAURANT, salonZones } from '../data/salonZones';
import { usePresentation } from '../context/PresentationContext';

const features = [
  { icon: Box, title: '3D Salon', desc: 'Masaları fırladın, yaxınlaşdırın, toxunun' },
  { icon: Eye, title: 'Seat View', desc: 'Oturacağınızdan real görünüş — kamera uçuşu' },
  { icon: Sparkles, title: 'Gündüz / Axşam', desc: 'Eyni masanın iki atmosferi' },
  { icon: Star, title: 'Premium Rezerv', desc: 'Bir toxunuşla admin panelə sinxron' },
];

const GuestHome = () => {
  const navigate = useNavigate();
  const { timeMode } = usePresentation();
  const isNight = timeMode === 'evening';
  const heroImg = isNight
    ? 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop'
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=900&fit=crop';

  return (
    <GuestShell transparent>
      <div className="relative min-h-[calc(100dvh-56px)] overflow-hidden">
        {/* Animated hero background */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover pres-ken-burns"
          />
          <div className={`absolute inset-0 transition-colors duration-700 ${isNight ? 'bg-gradient-to-b from-indigo-950/50 via-black/70 to-[#030508]' : 'bg-gradient-to-b from-black/30 via-black/60 to-[#050807]'}`} />
          <div className="pres-particles absolute inset-0 pointer-events-none" />
        </div>

        <div className="relative z-10 px-5 pt-6 pb-10 pres-safe-bottom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 pres-glass rounded-full px-3 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-widest">Canlı 3D Təqdimat</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1]">
              <span className="pres-gradient-text">{PRESENTATION_RESTAURANT.name}</span>
            </h1>
            <p className="text-white/70 mt-3 text-base leading-relaxed max-w-sm">
              Masanızı <strong className="text-white">3D salonda</strong> seçin.
              Oturacağınızdan <strong className="text-emerald-300">görünüşə baxın</strong> — rezervasiya edin.
            </p>
            <p className="text-white/40 text-xs mt-2 flex items-center gap-2">
              <Sparkles size={12} className="text-amber-400" />
              {PRESENTATION_RESTAURANT.tagline} · ★ {PRESENTATION_RESTAURANT.rating}
            </p>
          </motion.div>

          {/* Hero CTA — 3D */}
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/teqdimat/3d')}
            className="mt-8 w-full relative overflow-hidden rounded-3xl group pres-shimmer-btn"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            <div className="relative p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center pres-pulse-ring pres-float">
                <Box size={32} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">WOW Təcrübə</p>
                <p className="text-xl font-bold text-white">3D Salon + Seat View</p>
                <p className="text-xs text-white/70 mt-0.5">Masaya toxun → görünüşünüzü görün</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </motion.button>

          {/* Feature grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-2 mt-6"
          >
            {features.map((f, i) => (
              <div key={f.title} className="pres-glass rounded-2xl p-3">
                <f.icon size={18} className="text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-white">{f.title}</p>
                <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-4 space-y-2"
          >
            <button
              type="button"
              onClick={() => navigate('/teqdimat/explore')}
              className="w-full pres-glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-white/10 transition-colors"
            >
              <Compass size={22} className="text-emerald-400" />
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Salon turları</p>
                <p className="text-[10px] text-white/50">{salonZones.length} zona · foto galeriya</p>
              </div>
              <ArrowRight size={16} className="text-white/30" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[10px] text-white/25 mt-8"
          >
            Three.js · Canlı masa planı · Admin sinxron
          </motion.p>
        </div>
      </div>
    </GuestShell>
  );
};

export default GuestHome;
