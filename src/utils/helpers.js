import { format, parseISO, isValid } from 'date-fns';
import { az } from 'date-fns/locale';
import { DATE_FORMATS } from './constants';

export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, formatStr, { locale: az });
  } catch (error) {
    console.error('Date format error:', error);
    return '';
  }
};

export const formatCurrency = (amount, currency = 'AZN') => {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPhoneNumber = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

export const generateTableId = () => {
  return `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateReservationId = () => {
  return `RES${Date.now().toString().slice(-8)}`;
};

export const calculateOccupancyRate = (occupiedTables, totalTables) => {
  if (totalTables === 0) return 0;
  return Math.round((occupiedTables / totalTables) * 100);
};

export const getTimeFromDate = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

export const combineDateTime = (date, time) => {
  const [hours, minutes] = time.split(':');
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateObj.toISOString();
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const isPastDate = (date) => {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  return checkDate < new Date();
};

export const getTableCapacityColor = (currentGuests, capacity) => {
  const ratio = currentGuests / capacity;
  if (ratio >= 1) return '#EF4444';
  if (ratio >= 0.8) return '#F59E0B';
  return '#10B981';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const sortByDate = (array, dateKey, order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const calculateAverage = (array, key) => {
  if (array.length === 0) return 0;
  const sum = array.reduce((acc, item) => acc + (item[key] || 0), 0);
  return Math.round((sum / array.length) * 100) / 100;
};

export const getStatusBadgeClass = (status, statusColors) => {
  return statusColors[status] || 'primary';
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
