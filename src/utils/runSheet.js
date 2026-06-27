import { RESERVATION_STATUS_LABELS } from './constants';

export const printTodayRunSheet = ({ restaurant, reservations, events, waitlist, tables }) => {
  const today = new Date().toDateString();
  const todayRes = reservations
    .filter((r) => new Date(r.date).toDateString() === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const todayEvents = (events || [])
    .filter((e) => new Date(e.date).toDateString() === today)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  const occupied = tables.filter((t) => t.status === 'occupied');

  const html = `<!DOCTYPE html><html lang="az"><head><meta charset="UTF-8"/>
<title>Günün run sheet — ${restaurant?.name || 'SeatMind'}</title>
<style>
  body { font-family: system-ui, sans-serif; font-size: 12px; color: #1e293b; margin: 24px; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .meta { color: #64748b; margin-bottom: 20px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 20px 0 8px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
  th { font-size: 10px; color: #64748b; text-transform: uppercase; }
  .vip { font-weight: bold; }
  @media print { body { margin: 12px; } }
</style></head><body>
<h1>${restaurant?.name || 'Restoran'}</h1>
<p class="meta">Günün run sheet · ${new Date().toLocaleDateString('az-AZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${todayRes.length} rezerv · ${todayEvents.length} tədbir · ${waitlist?.length || 0} gözləmə</p>

<h2>Rezervasiyalar</h2>
<table><thead><tr><th>Saat</th><th>Qonaq</th><th>Nəfər</th><th>Masa</th><th>Zona</th><th>Status</th><th>Qeyd</th></tr></thead><tbody>
${todayRes.map((r) => `<tr class="${r.vip ? 'vip' : ''}"><td>${r.time}</td><td>${r.customerName}${r.vip ? ' ★' : ''}</td><td>${r.partySize}</td><td>${r.tableNumber || '—'}</td><td>${r.zone || '—'}</td><td>${RESERVATION_STATUS_LABELS[r.status] || r.status}</td><td>${r.notes || ''}${r.dietary && r.dietary !== 'none' ? ` · ${r.dietary}` : ''}</td></tr>`).join('')}
</tbody></table>

<h2>Tədbirlər</h2>
<table><thead><tr><th>Saat</th><th>Ad</th><th>Nəfər</th><th>Masa</th><th>Depozit</th></tr></thead><tbody>
${todayEvents.length ? todayEvents.map((e) => `<tr><td>${e.startTime}</td><td>${e.title}</td><td>${e.partySize}</td><td>${(e.tableIds || []).join(', ') || '—'}</td><td>${e.depositPaid ? 'Ödənilib' : e.deposit ? 'Gözləyir' : '—'}</td></tr>`).join('') : '<tr><td colspan="5">Bu gün tədbir yoxdur</td></tr>'}
</tbody></table>

<h2>Gözləmə siyahısı</h2>
<table><thead><tr><th>Qonaq</th><th>Nəfər</th><th>Gözləmə</th><th>Prioritet</th></tr></thead><tbody>
${(waitlist || []).length ? waitlist.map((w) => `<tr><td>${w.customerName}</td><td>${w.partySize}</td><td>${w.waitTime} dəq</td><td>${w.priority}</td></tr>`).join('') : '<tr><td colspan="4">Boş</td></tr>'}
</tbody></table>

<h2>Hal-hazırda dolu masalar (${occupied.length})</h2>
<table><thead><tr><th>Masa</th><th>Qonaq</th><th>Nəfər</th><th>Faza</th></tr></thead><tbody>
${occupied.map((t) => `<tr><td>${t.number}</td><td>${t.guestName || '—'}</td><td>${t.partySize || '—'}</td><td>${t.servicePhase || '—'}</td></tr>`).join('')}
</tbody></table>
<script>window.onload=function(){window.print();}</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  return true;
};
