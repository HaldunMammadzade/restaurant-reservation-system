import React from 'react';
import { ChefHat, AlertTriangle, UtensilsCrossed, PartyPopper, Ban } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';

const typeIcons = { dietary: UtensilsCrossed, occasion: PartyPopper, event: PartyPopper, stock: ChefHat, '86': Ban };
const priorityStyle = { high: 'border-rose-200 bg-rose-50', normal: 'border-slate-100 bg-white' };

const PrepList = () => {
  const { prepList } = useApp();

  const sections = [
    { title: 'Dietary / Allergen', items: prepList.dietaryItems, icon: UtensilsCrossed },
    { title: 'Xüsusi tədbirlər', items: prepList.occasionItems, icon: PartyPopper },
    { title: 'Tədbir hazırlığı', items: prepList.eventPrep, icon: ChefHat },
    { title: 'Populyar məhsul hazırlığı', items: prepList.popularItems, icon: ChefHat },
    { title: '86 — Bitmiş', items: prepList.unavailable, icon: Ban },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mətbəx Prep Siyahısı"
        subtitle="Bu gecə üçün şefə hazırlıq — dietary, tədbir, stock"
        badge={`${prepList.totalCovers} cover`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cover', value: prepList.totalCovers },
          { label: 'Dietary', value: prepList.dietaryItems.length },
          { label: 'Tədbir', value: prepList.eventPrep.length },
          { label: '86 məhsul', value: prepList.unavailable.length },
        ].map((s) => (
          <div key={s.label} className="card-premium text-center">
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sections.map((sec) => (
          <Card key={sec.title} title={sec.title} premium
            headerAction={<sec.icon size={16} className="text-slate-400" />}>
            {sec.items.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">—</p>
            ) : (
              <div className="space-y-2">
                {sec.items.map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${priorityStyle[item.priority] || priorityStyle.normal}`}>
                    {item.priority === 'high' && <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-2">
                        {item.count && <span>{item.count} nəfər</span>}
                        {item.time && <span>{item.time}</span>}
                        {item.partySize && <span>{item.partySize} nəfər</span>}
                        {item.prepTime && <span>{item.prepTime}</span>}
                        {item.estimatedQty && <span>~{item.estimatedQty} porsiya</span>}
                        {item.notes && <span>{item.notes}</span>}
                      </div>
                      {item.checklist?.length > 0 && (
                        <ul className="mt-1 text-[10px] text-amber-700">
                          {item.checklist.map((c) => <li key={c}>○ {c}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrepList;
