import React, { useState } from 'react';
import { Save, Building, Clock, Bell, Users, Ban, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const dayLabels = {
  monday: 'Bazar ertəsi', tuesday: 'Çərşənbə axşamı', wednesday: 'Çərşənbə',
  thursday: 'Cümə axşamı', friday: 'Cümə', saturday: 'Şənbə', sunday: 'Bazar',
};

const Settings = () => {
  const { restaurant, setRestaurant, resetDemoData, user, setUserRole } = useApp();
  const [activeTab, setActiveTab] = useState('restaurant');
  const [userData, setUserData] = useState(user);
  const [notifications, setNotifications] = useState({
    email: true, sms: true, whatsapp: true, autoConfirm: false,
  });

  const [blockedForm, setBlockedForm] = useState({ date: '', reason: '', allDay: true, slots: '' });

  const tabs = [
    { id: 'restaurant', label: 'Restoran', icon: Building },
    { id: 'hours', label: 'İş Saatları', icon: Clock },
    { id: 'capacity', label: 'Kapasitet', icon: Ban },
    { id: 'notifications', label: 'Bildirişlər', icon: Bell },
    { id: 'profile', label: 'Profil', icon: Users },
  ];

  const handleSave = () => {
    setUserRole(userData.role);
    toast.success('Tənzimləmələr yadda saxlanıldı!');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tənzimləmələr" subtitle="Sistem və restoran parametrlərini idarə edin" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <Card className="lg:col-span-1" premium delay={0.1}>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'restaurant' && (
                <Card title="Restoran Məlumatları" premium>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Input label="Restoran Adı" name="name" value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} required />
                    <Input label="Ünvan" name="address" value={restaurant.address} onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Telefon" name="phone" type="tel" value={restaurant.phone} onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })} required />
                      <Input label="Email" name="email" type="email" value={restaurant.email} onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Orta Rezervasiya Müddəti (dəq)" type="number" value={restaurant.settings.reservationDuration} onChange={(e) => setRestaurant({ ...restaurant, settings: { ...restaurant.settings, reservationDuration: e.target.value } })} />
                      <Input label="Maksimum Qrup Sayı" type="number" value={restaurant.settings.maxPartySize} onChange={(e) => setRestaurant({ ...restaurant, settings: { ...restaurant.settings, maxPartySize: e.target.value } })} />
                    </div>
                    <Button type="submit" variant="primary" fullWidth icon={<Save size={18} />}>Dəyişiklikləri Yadda Saxla</Button>
                    <Button type="button" variant="outline" fullWidth onClick={() => { resetDemoData(); toast.success('Demo məlumatlar bərpa edildi'); }}>
                      Demo Məlumatları Bərpa Et
                    </Button>
                  </form>
                </Card>
              )}

              {activeTab === 'hours' && (
                <Card title="İş Saatları" premium>
                  <div className="space-y-3">
                    {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="w-36">
                          <span className="font-semibold text-slate-700 text-sm">{dayLabels[day]}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input label="Açılış" type="time" value={hours.open} onChange={(e) => setRestaurant({ ...restaurant, openingHours: { ...restaurant.openingHours, [day]: { ...hours, open: e.target.value } } })} />
                          <Input label="Bağlanış" type="time" value={hours.close} onChange={(e) => setRestaurant({ ...restaurant, openingHours: { ...restaurant.openingHours, [day]: { ...hours, close: e.target.value } } })} />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="primary" fullWidth icon={<Save size={18} />} onClick={handleSave}>Dəyişiklikləri Yadda Saxla</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'capacity' && (
                <Card title="Kapasitet və bağlı günlər" premium>
                  <div className="space-y-4">
                    <Input label="Saat başına maksimum qonaq (covers)" type="number"
                      value={restaurant.settings.maxCoversPerSlot || ''}
                      onChange={(e) => setRestaurant({
                        ...restaurant,
                        settings: { ...restaurant.settings, maxCoversPerSlot: parseInt(e.target.value, 10) || 0 },
                      })}
                      placeholder="Məs: 48" />
                    <p className="text-xs text-slate-500">Online rezervasiya və QR booking bu limiti nəzərə alır.</p>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Bağlı tarixlər</h4>
                      <div className="space-y-2 mb-4">
                        {(restaurant.settings.blockedDates || []).map((bd, idx) => (
                          <div key={`${bd.date}-${idx}`} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{new Date(bd.date).toLocaleDateString('az-AZ', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{bd.reason}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{bd.allDay ? 'Bütün gün bağlı' : `Slotlar: ${(bd.slots || []).join(', ')}`}</p>
                            </div>
                            <button type="button" onClick={() => {
                              const next = [...(restaurant.settings.blockedDates || [])];
                              next.splice(idx, 1);
                              setRestaurant({ ...restaurant, settings: { ...restaurant.settings, blockedDates: next } });
                            }} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border border-dashed border-slate-200 rounded-xl space-y-3">
                        <p className="text-xs font-medium text-slate-600">Yeni bağlı tarix</p>
                        <Input label="Tarix" type="date" value={blockedForm.date} onChange={(e) => setBlockedForm({ ...blockedForm, date: e.target.value })} />
                        <Input label="Səbəb" value={blockedForm.reason} onChange={(e) => setBlockedForm({ ...blockedForm, reason: e.target.value })} placeholder="Private tədbir, təmir..." />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={blockedForm.allDay} onChange={(e) => setBlockedForm({ ...blockedForm, allDay: e.target.checked })} />
                          Bütün gün bağlı
                        </label>
                        {!blockedForm.allDay && (
                          <Input label="Bağlı slotlar (vergüllə)" value={blockedForm.slots} onChange={(e) => setBlockedForm({ ...blockedForm, slots: e.target.value })} placeholder="19:00, 19:30, 20:00" />
                        )}
                        <Button type="button" variant="outline" icon={<Plus size={16} />} onClick={() => {
                          if (!blockedForm.date || !blockedForm.reason) { toast.error('Tarix və səbəb daxil edin'); return; }
                          const entry = {
                            date: blockedForm.date,
                            reason: blockedForm.reason,
                            allDay: blockedForm.allDay,
                            slots: blockedForm.allDay ? [] : blockedForm.slots.split(',').map((s) => s.trim()).filter(Boolean),
                          };
                          setRestaurant({
                            ...restaurant,
                            settings: {
                              ...restaurant.settings,
                              blockedDates: [...(restaurant.settings.blockedDates || []), entry],
                            },
                          });
                          setBlockedForm({ date: '', reason: '', allDay: true, slots: '' });
                          toast.success('Bağlı tarix əlavə edildi');
                        }}>Əlavə et</Button>
                      </div>
                    </div>
                    <Button type="button" variant="primary" fullWidth icon={<Save size={18} />} onClick={handleSave}>Yadda saxla</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card title="Bildiriş Tənzimləmələri" premium>
                  <div className="space-y-3">
                    {[
                      { key: 'email', title: 'Email Bildirişləri', desc: 'Yeni rezervasiyalar üçün email al' },
                      { key: 'sms', title: 'SMS Bildirişləri', desc: 'Müştərilərə SMS xatırlatma göndər' },
                      { key: 'whatsapp', title: 'WhatsApp Bildirişləri', desc: 'WhatsApp ilə rezervasiya təsdiqləri' },
                      { key: 'autoConfirm', title: 'Avtomatik Təsdiq', desc: 'Rezervasiyaları avtomatik təsdiqlə' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={notifications[item.key]} onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} />
                          <div className="toggle-track relative" />
                        </label>
                      </div>
                    ))}
                    <Button type="button" variant="primary" fullWidth icon={<Save size={18} />} onClick={handleSave}>Dəyişiklikləri Yadda Saxla</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'profile' && (
                <Card title="Profil Məlumatları" premium>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="w-20 h-20 bg-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <Button type="button" variant="outline" size="small">Şəkil Yüklə</Button>
                        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG (max 2MB)</p>
                      </div>
                    </div>
                    <Input label="Ad Soyad" name="name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} required />
                    <Input label="Email" name="email" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
                    <Select label="Rol" name="role" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} options={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'manager', label: 'Menecer' },
                      { value: 'hostess', label: 'Hostess' },
                      { value: 'server', label: 'Ofisiant' },
                      { value: 'kitchen', label: 'Mətbəx' },
                    ]} />
                    <p className="text-xs text-slate-500">Rol dəyişdikdə sidebar menyusu avtomatik yenilənir (demo).</p>
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-semibold text-slate-800 mb-3 text-sm">Şifrəni Dəyiş</h4>
                      <div className="space-y-3">
                        <Input label="Cari Şifrə" type="password" placeholder="••••••••" />
                        <Input label="Yeni Şifrə" type="password" placeholder="••••••••" />
                        <Input label="Yeni Şifrəni Təsdiqlə" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <Button type="submit" variant="primary" fullWidth icon={<Save size={18} />}>Dəyişiklikləri Yadda Saxla</Button>
                  </form>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
