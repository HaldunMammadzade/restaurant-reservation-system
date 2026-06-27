import React, { useState } from 'react';
import { Star, Gift, Megaphone, MessageSquare, Send, Award } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { getCustomerLoyalty } from '../utils/loyaltyEngine';
import toast from 'react-hot-toast';

const Loyalty = () => {
  const { customers, loyaltyProgram, campaigns, feedbacks, runCampaign, redeemLoyaltyReward } = useApp();
  const [tab, setTab] = useState('members');

  const topMembers = [...customers].sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0)).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader title="Loyalty & Kampaniyalar" subtitle="Xal proqramı, mükafatlar, avtomatik SMS və feedback" />

      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'members', label: 'Üzvlər', icon: Award },
          { id: 'campaigns', label: 'Kampaniyalar', icon: Megaphone },
          { id: 'feedback', label: 'Feedback', icon: Star },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${tab === t.id ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'members' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loyaltyProgram.tiers.map((tier) => (
              <div key={tier.id} className={`card-premium ${tier.color}`}>
                <p className="font-bold">{tier.name}</p>
                <p className="text-xs mt-1">{tier.minPoints}+ xal · {tier.discount}% endirim</p>
                <p className="text-lg font-bold mt-2">{customers.filter((c) => getCustomerLoyalty(c, loyaltyProgram).tier.id === tier.id).length} üzv</p>
              </div>
            ))}
          </div>
          <Card title="Top üzvlər" premium>
            <div className="space-y-2">
              {topMembers.map((c) => {
                const loy = getCustomerLoyalty(c, loyaltyProgram);
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm">{c.name} {c.vip && '★'}</p>
                      <p className="text-xs text-slate-500">{loy.tier.name} · {loy.points} xal · {c.visitCount} ziyarət</p>
                    </div>
                    <div className="flex gap-1">
                      {loyaltyProgram.rewards.slice(0, 1).map((rw) => (
                        <Button key={rw.id} size="small" variant="outline" onClick={() => {
                          if (redeemLoyaltyReward(c.id, rw.id)) toast.success(`${rw.name} tətbiq edildi`);
                          else toast.error('Kifayət xal yoxdur');
                        }}>
                          <Gift size={12} />
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {tab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <Card key={camp.id} premium>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{camp.name}</h4>
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">{camp.status}</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{camp.trigger} · {camp.channel}</p>
              <p className="text-sm text-slate-600 italic mb-3">"{camp.template}"</p>
              <div className="flex justify-between text-xs text-slate-500 mb-3">
                <span>{camp.sent} göndərildi</span>
                <span>{camp.converted} konversiya ({camp.sent ? Math.round((camp.converted / camp.sent) * 100) : 0}%)</span>
              </div>
              <Button size="small" variant="primary" icon={<Send size={14} />} fullWidth
                onClick={() => { runCampaign(camp.id); toast.success('Kampaniya göndərildi'); }}>
                İndi göndər (demo)
              </Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'feedback' && (
        <Card title="Müştəri feedback" premium>
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-sm">{fb.customerName}</span>
                  <span className="flex gap-0.5">{Array.from({ length: fb.rating }).map((_, i) => <Star key={i} size={12} className="text-amber-500 fill-amber-500" />)}</span>
                </div>
                <p className="text-sm text-slate-600">{fb.comment}</p>
                <p className="text-[10px] text-slate-400 mt-1">Masa {fb.tableNumber}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Loyalty;
