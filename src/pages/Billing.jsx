import React, { useState, useMemo } from 'react';
import { CreditCard, Banknote, Percent, Gift, Printer, Split } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';
import { TABLE_STATUS } from '../utils/constants';
import { calculateTableBill, splitBill, printBillReceipt } from '../utils/billingHelpers';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const Billing = () => {
  const { tables, restaurant, closeTableBill, getCustomerForPhone } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [comp, setComp] = useState(0);
  const [tip, setTip] = useState(0);
  const [method, setMethod] = useState('card');
  const [split, setSplit] = useState(1);

  const billable = useMemo(() =>
    tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED && (t.orders?.length > 0 || t.servicePhase === 'bill')),
  [tables]);

  const table = tables.find((t) => t.id === selectedId);
  const bill = table ? calculateTableBill(table, { discountPercent: discount, compAmount: comp }) : null;
  const splits = bill ? splitBill(bill.total, split) : [];

  const handleClose = () => {
    if (!table) return;
    const result = closeTableBill(table.id, {
      discountPercent: discount, compAmount: comp, paymentMethod: method, tipAmount: tip, splitParts: split,
    });
    if (result) {
      toast.success(`Hesab bağlandı: ${formatCurrency(result.total)}`);
      setSelectedId(null);
      setDiscount(0); setComp(0); setTip(0);
    }
  };

  const handlePrint = () => {
    if (!table || !bill) return;
    printBillReceipt({
      restaurant, table, bill,
      payments: [{ method, amount: bill.total }],
      guestName: table.guestName,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kassa" subtitle="Hesab bağlama, endirim, comp, bölünmüş ödəniş və çek" badge={`${billable.length} açıq hesab`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">Açıq masalar</h3>
          {billable.length === 0 ? (
            <Card premium><p className="text-sm text-slate-400 text-center py-6">Açıq hesab yoxdur</p></Card>
          ) : billable.map((t) => {
            const b = calculateTableBill(t);
            return (
              <button key={t.id} onClick={() => setSelectedId(t.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${selectedId === t.id ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex justify-between">
                  <span className="font-bold">Masa {t.number}</span>
                  <span className="font-bold text-primary-600">{formatCurrency(b.total)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{t.guestName} · {(t.orders || []).length} sifariş</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {table && bill ? (
            <Card title={`Masa ${table.number} — Hesab`} premium>
              <div className="space-y-2 mb-4">
                {(table.orders || []).map((o) => (
                  <div key={o.id} className="flex justify-between text-sm py-2 border-b border-slate-50">
                    <span>{o.name} ×{o.qty}</span>
                    <span className="font-medium">{formatCurrency(o.price * o.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 text-sm mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between"><span>Ara cəm</span><span>{formatCurrency(bill.subtotal)}</span></div>
                <div className="flex justify-between"><span>Servis (10%)</span><span>{formatCurrency(bill.serviceCharge)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Endirim {discount}%</span><span>-{formatCurrency(bill.discount)}</span></div>}
                {comp > 0 && <div className="flex justify-between text-rose-600"><span>Comp</span><span>-{formatCurrency(comp)}</span></div>}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                  <span>CƏMİ</span><span>{formatCurrency(bill.total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <label className="text-xs">
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Percent size={12} /> Endirim %</span>
                  <input type="number" min="0" max="50" value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" />
                </label>
                <label className="text-xs">
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Gift size={12} /> Comp (AZN)</span>
                  <input type="number" min="0" value={comp} onChange={(e) => setComp(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" />
                </label>
                <label className="text-xs">
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Banknote size={12} /> Tip</span>
                  <input type="number" min="0" value={tip} onChange={(e) => setTip(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" />
                </label>
                <label className="text-xs">
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Split size={12} /> Bölmə</span>
                  <select value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm">
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} nəfər</option>)}
                  </select>
                </label>
              </div>

              {split > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {splits.map((amt, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium">Hissə {i + 1}: {formatCurrency(amt)}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mb-4">
                {['card', 'cash', 'mixed'].map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border ${method === m ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600'}`}>
                    {m === 'card' ? 'Kart' : m === 'cash' ? 'Nağd' : 'Qarışıq'}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" icon={<Printer size={16} />} onClick={handlePrint}>Çek</Button>
                <Button variant="primary" fullWidth icon={<CreditCard size={16} />} onClick={handleClose}>
                  Hesabı bağla · {formatCurrency(bill.total)}
                </Button>
              </div>
            </Card>
          ) : (
            <Card premium><p className="text-center text-slate-400 py-16">Hesab bağlamaq üçün masa seçin</p></Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
