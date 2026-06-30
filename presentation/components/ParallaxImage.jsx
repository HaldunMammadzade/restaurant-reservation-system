import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxImage = ({
  src, alt = '', className = '', kenBurns = true, intensity = 20,
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const [gyro, setGyro] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onOrient = (e) => {
      if (e.gamma == null) return;
      setGyro({
        x: Math.max(-1, Math.min(1, e.gamma / 45)),
        y: Math.max(-1, Math.min(1, (e.beta - 45) / 45)),
      });
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, []);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px * intensity);
    y.set(py * intensity);
  };

  const offsetX = useTransform(springX, (v) => v + gyro.x * (intensity * 0.5));
  const offsetY = useTransform(springY, (v) => v + gyro.y * (intensity * 0.5));

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMove}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) onMove({ clientX: t.clientX, clientY: t.clientY });
      }}
    >
      <motion.div
        className="absolute inset-[-8%] w-[116%] h-[116%]"
        style={{ x: offsetX, y: offsetY }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${kenBurns ? 'pres-ken-burns' : ''}`}
          draggable={false}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />
    </div>
  );
};

export default ParallaxImage;
