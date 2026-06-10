import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChefHat, Sparkles, BarChart3, Grid3x3, Calendar, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { DEMO_CREDENTIALS } from '../utils/mockData';

const features = [
  { icon: Sparkles, title: 'AI Optimallaşdırma', desc: 'Ağıllı rezervasiya və doluluq proqnozu' },
  { icon: Grid3x3, title: 'İnteraktiv Masa Planı', desc: 'Real-time masa idarəetməsi' },
  { icon: BarChart3, title: 'Detallı Analitika', desc: 'Gəlir və performans hesabatları' },
  { icon: Calendar, title: 'Rezervasiya Sistemi', desc: 'Tam avtomatlaşdırılmış booking' },
];

const Login = () => {
  const { login, demoLogin, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-primary-900 to-violet-900 overflow-hidden">
        <div className="absolute inset-0 ai-shimmer opacity-20" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                <ChefHat size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SeatMind</h1>
                <p className="text-xs text-primary-300 font-medium">AI Restaurant OS</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                Restoranınızı<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-violet-300">
                  AI ilə idarə edin
                </span>
              </h2>
              <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                Rezervasiyalar, masa planı, analitika və AI tövsiyələri — hamısı bir platformada.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
              >
                <feature.icon size={20} className="text-primary-300 mb-2" />
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-slate-500">© 2026 SeatMind. Bütün hüquqlar qorunur.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl mb-4 shadow-premium-lg">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">SeatMind</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-premium-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Xoş gəldiniz</h2>
            <p className="text-slate-500 text-sm mb-6">Hesabınıza daxil olun</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                icon={<Mail size={18} />}
                required
              />

              <Input
                label="Şifrə"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-slate-600">Məni xatırla</span>
                </label>
              </div>

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Daxil ol
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400">və ya</span>
              </div>
            </div>

            <button
              onClick={demoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-primary-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Zap size={18} />
              Demo ilə daxil ol
              <ArrowRight size={16} />
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </p>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Hesabınız yoxdur?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Qeydiyyatdan keç
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
