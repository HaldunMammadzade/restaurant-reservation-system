import React from 'react';
import {
  Cake, Gem, Heart, Building2, Crown, Wine, GraduationCap, UtensilsCrossed,
} from 'lucide-react';
import { OCCASION_TYPES } from '../../utils/constants';

const iconMap = {
  [OCCASION_TYPES.STANDARD]: UtensilsCrossed,
  [OCCASION_TYPES.BIRTHDAY]: Cake,
  [OCCASION_TYPES.ENGAGEMENT]: Gem,
  [OCCASION_TYPES.WEDDING]: Heart,
  [OCCASION_TYPES.ANNIVERSARY]: Heart,
  [OCCASION_TYPES.CORPORATE]: Building2,
  [OCCASION_TYPES.PRIVATE_DINING]: Crown,
  [OCCASION_TYPES.TASTING]: Wine,
  [OCCASION_TYPES.GRADUATION]: GraduationCap,
};

const OccasionIcon = ({ type, size = 18, className = 'text-primary-600' }) => {
  const Icon = iconMap[type] || UtensilsCrossed;
  return <Icon size={size} className={className} />;
};

export default OccasionIcon;
