import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MenuItemImage from '../components/menu/MenuItemImage';
import { MENU_CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const TableMenu = () => {
  const { tableId } = useParams();
  const { tables, menuItems, restaurant, addTableOrder } = useApp();
  const [cart, setCart] = useState({});

  const table = tables.find((t) => t.id === tableId || t.number === tableId);
  const available = menuItems.filter((m) => m.available);

  const addToCart = (item) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
  };

  const submitOrder = () => {
    if (!table) { toast.error('Masa tapılmadı'); return; }
    Object.entries(cart).forEach(([id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      if (item) for (let i = 0; i < qty; i++) addTableOrder(table.id, item);
    });
    toast.success('Sifariş mətbəxə göndərildi!');
    setCart({});
  };

  const cartTotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return s + (item?.price || 0) * qty;
  }, 0);

  if (!table) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-slate-500">Masa tapılmadı. URL: /table/t_g2 və ya /table/2</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-primary-600 text-white p-5">
        <p className="text-xs opacity-80">{restaurant?.name}</p>
        <h1 className="text-xl font-bold">Masa {table.number}</h1>
        <p className="text-sm opacity-90 mt-1">Menyudan sifariş verin — birbaşa mətbəxə düşür</p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {available.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-32"><MenuItemImage item={item} /></div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-[10px] text-slate-400">{MENU_CATEGORIES[item.category]}</p>
                </div>
                <span className="font-bold text-primary-600 text-sm">{formatCurrency(item.price)}</span>
              </div>
              <button onClick={() => addToCart(item)} className="mt-2 w-full py-2 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                <Plus size={14} /> Əlavə et
              </button>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold">{formatCurrency(cartTotal)}</p>
              <p className="text-xs text-slate-500">{Object.values(cart).reduce((a, b) => a + b, 0)} məhsul</p>
            </div>
            <button onClick={submitOrder} className="flex-1 max-w-xs py-3 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Sifariş ver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableMenu;
