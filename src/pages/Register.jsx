import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, ChefHat, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', restaurantName: '',
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Şifrələr uyğun gəlmir!');
      return;
    }
    const { confirmPassword, ...userData } = formData;
    await register(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Geri qayıt
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-xl mb-3">
            <ChefHat size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">SeatMind</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-premium-xl p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Qeydiyyatdan keç</h2>
          <p className="text-slate-500 text-sm mb-6">Restoranınızı qeydiyyata alın</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Ad Soyad" name="name" value={formData.name} onChange={handleChange} placeholder="Adınız və soyadınız" icon={<User size={18} />} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" icon={<Mail size={18} />} required />
            <Input label="Restoran Adı" name="restaurantName" value={formData.restaurantName} onChange={handleChange} placeholder="Restoranınızın adı" icon={<Building size={18} />} required />
            <Input label="Şifrə" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={<Lock size={18} />} required />
            <Input label="Şifrəni təsdiqlə" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={<Lock size={18} />} required />
            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
              Qeydiyyatdan keç
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Artıq hesabınız var?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Daxil ol</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
