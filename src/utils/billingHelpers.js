export const SERVICE_CHARGE_RATE = 0.1;

export const calculateTableBill = (table, { discountPercent = 0, compAmount = 0, loyaltyDiscount = 0 } = {}) => {
  const subtotal = (table.orders || []).reduce((s, o) => s + o.price * o.qty, 0);
  const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE * 100) / 100;
  const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const total = Math.max(0, subtotal + serviceCharge - discount - compAmount - loyaltyDiscount);
  return { subtotal, serviceCharge, discount, compAmount, loyaltyDiscount, total };
};

export const splitBill = (total, parts = 2) => {
  const perPart = Math.round((total / parts) * 100) / 100;
  const amounts = Array(parts - 1).fill(perPart);
  amounts.push(Math.round((total - perPart * (parts - 1)) * 100) / 100);
  return amounts;
};

export const printBillReceipt = ({ restaurant, table, bill, payments, guestName }) => {
  const lines = (table.orders || []).map((o) =>
    `<tr><td>${o.name} ×${o.qty}</td><td style="text-align:right">${(o.price * o.qty).toFixed(2)} AZN</td></tr>`,
  ).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hesab ${table.number}</title>
<style>body{font-family:monospace;padding:20px;max-width:320px;margin:0 auto}h2{font-size:16px}table{width:100%;font-size:12px}td{padding:4px 0}.total{font-weight:bold;font-size:14px;border-top:2px dashed #000;padding-top:8px}</style></head><body>
<h2>${restaurant?.name || 'SeatMind'}</h2><p>Masa ${table.number} · ${guestName || table.guestName || 'Qonaq'}</p>
<p style="font-size:11px;color:#666">${new Date().toLocaleString('az-AZ')}</p>
<table>${lines}</table>
<table style="margin-top:12px">
<tr><td>Ara cəm</td><td style="text-align:right">${bill.subtotal.toFixed(2)} AZN</td></tr>
<tr><td>Servis (10%)</td><td style="text-align:right">${bill.serviceCharge.toFixed(2)} AZN</td></tr>
${bill.discount > 0 ? `<tr><td>Endirim</td><td style="text-align:right">-${bill.discount.toFixed(2)}</td></tr>` : ''}
${bill.compAmount > 0 ? `<tr><td>Comp</td><td style="text-align:right">-${bill.compAmount.toFixed(2)}</td></tr>` : ''}
${bill.loyaltyDiscount > 0 ? `<tr><td>Loyalty</td><td style="text-align:right">-${bill.loyaltyDiscount.toFixed(2)}</td></tr>` : ''}
<tr class="total"><td>CƏMİ</td><td style="text-align:right">${bill.total.toFixed(2)} AZN</td></tr>
</table>
${payments ? `<p style="margin-top:12px;font-size:11px">Ödəniş: ${payments.map((p) => `${p.method} ${p.amount.toFixed(2)}`).join(' + ')}</p>` : ''}
<p style="text-align:center;margin-top:20px;font-size:11px">Təşəkkür edirik!</p>
<script>window.onload=function(){window.print()}</script></body></html>`;
  const w = window.open('', '_blank', 'width=400,height=600');
  if (w) { w.document.write(html); w.document.close(); }
  return !!w;
};
