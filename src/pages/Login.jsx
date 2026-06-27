import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';
import { Mail, Lock, BarChart3, Grid3x3, Calendar, ArrowRight, PartyPopper } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { DEMO_CREDENTIALS } from '../utils/mockData';

const features = [
  { icon: Calendar, title: 'Rezervasiyalar', desc: 'Rezerv, tədbir, QR booking' },
  { icon: Grid3x3, title: 'Masa planı', desc: 'Çoxmərtəbəli, canlı status' },
  { icon: PartyPopper, title: 'Tədbirlər', desc: 'Ad günü, toy, korporativ' },
  { icon: BarChart3, title: 'Analitika', desc: 'Gəlir və doluluq hesabatları' },
];

const Login = () => {
  const { login, demoLogin, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); await login(formData.email, formData.password); };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[440px] bg-slate-900 text-white flex-col justify-between p-10">
        <Logo size="lg" className="[&_h1]:text-white [&_p]:text-slate-400" />
        <div>
          <h2 className="text-3xl font-bold leading-tight mb-3">Restoranınızı bir paneldən idarə edin</h2>
          <p className="text-slate-400 text-sm leading-relaxed">Rezervasiya, masa planı, mətbəx expo, mesajlar və tədbir idarəetməsi.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.title} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <f.icon size={18} className="text-slate-300 mb-2" />
              <h3 className="text-sm font-medium">{f.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600">© 2026 SeatMind</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo size="lg" /></div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Daxil ol</h2>
            <p className="text-slate-500 text-sm mb-6">Hesab məlumatlarınızı daxil edin</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} icon={<Mail size={18} />} required />
              <Input label="Şifrə" type="password" name="password" value={formData.password} onChange={handleChange} icon={<Lock size={18} />} required />
              <Button type="submit" variant="primary" fullWidth loading={loading}>Daxil ol</Button>
            </form>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-slate-400">və ya</span></div>
            </div>
            <Button type="button" variant="outline" fullWidth onClick={demoLogin} disabled={loading} icon={<ArrowRight size={16} />}>
              Demo ilə daxil ol
            </Button>
            <p className="text-center text-xs text-slate-400 mt-3">{DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
            <p className="mt-5 text-center text-sm text-slate-500">
              Hesab yoxdur? <Link to="/register" className="text-primary-600 font-medium">Qeydiyyat</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
