import React, { useState } from 'react';
import { UtensilsCrossed, Salad, Cake, Coffee, Star } from 'lucide-react';
import { MENU_CATEGORIES } from '../../utils/constants';

const categoryFallback = {
  appetizer: { icon: Salad, bg: 'bg-amber-100', color: 'text-amber-600' },
  main: { icon: UtensilsCrossed, bg: 'bg-rose-100', color: 'text-rose-600' },
  dessert: { icon: Cake, bg: 'bg-pink-100', color: 'text-pink-600' },
  drink: { icon: Coffee, bg: 'bg-cyan-100', color: 'text-cyan-600' },
  special: { icon: Star, bg: 'bg-indigo-100', color: 'text-indigo-600' },
};

const MenuItemImage = ({ item, className = 'w-full h-full object-cover' }) => {
  const [failed, setFailed] = useState(false);
  const fb = categoryFallback[item.category] || categoryFallback.main;
  const FallbackIcon = fb.icon;

  if (!item.image || failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center ${fb.bg} px-4 text-center`}>
        <FallbackIcon size={40} className={fb.color} />
        <span className="text-xs font-medium text-slate-600 mt-2 line-clamp-2">{item.name}</span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};

export default MenuItemImage;
