'use client';

import React, { useState, useEffect, use } from 'react';
import { Wallet, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader';
import { useAuthStore } from '@/store/useAuthStore';
import { registerUser } from '@/api/auth';

export default function ExpenseSignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const loading = useAuthStore(state => state.loading);
  const {setLoading, setError} = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(formData);
      // Handle success (e.g., redirect to login or auto-login)
      console.log('Registered user:', response.data);
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.error?.message ||
        error.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      {/* Animated particle background */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(52, 211, 153, ${p.opacity})`,
            }}
          />
        ))}
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }} />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md" onClick={createRipple}>
        {/* Ripple effects */}
        {ripples.map(r => (
          <div
            key={r.id}
            className="absolute rounded-full border-2 border-emerald-400 pointer-events-none"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              animation: 'ripple 1s ease-out forwards',
            }}
          />
        ))}

        {/* Rotating gradient border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-400 rounded-3xl opacity-75 blur-lg animate-spin-slow" />

        {/* Sign up card */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/30 shadow-2xl p-8 overflow-hidden">
          {/* Animated scanline effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" 
                 style={{ animation: 'scanline 3s ease-in-out infinite' }} />
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400 animate-pulse" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-teal-400 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 animate-pulse" style={{ animationDelay: '1.5s' }} />

          {/* Header */}
          <div className="relative mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl mb-4 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <Wallet className="text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" size={40} />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Sparkles className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" size={40} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 mb-2 tracking-tight animate-gradient">
              hEx.ly
            </h1>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <TrendingUp size={16} className="text-emerald-400 animate-bounce" />
              Smart expense tracking starts here
            </p>
          </div>

          <div className="space-y-5 relative">
            {/* Name field */}
            <div className="relative group">
              <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-transparent" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:bg-slate-800 transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Email field */}
            <div className="relative group">
              <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-transparent" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:bg-slate-800 transition-all duration-300"
                  placeholder="you@example.com"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Password field */}
            <div className="relative group">
              <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-transparent" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:bg-slate-800 transition-all duration-300"
                  placeholder="Create a secure password"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 flex justify-around">
                <div className="w-1 h-full bg-white/20 animate-shimmer" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-full bg-white/20 animate-shimmer" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 h-full bg-white/20 animate-shimmer" style={{ animationDelay: '0.6s' }} />
              </div>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Already tracking?{' '}
            <Link 
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer hover:underline"
            >
              Sign In →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 400px;
            height: 400px;
            opacity: 0;
            margin-left: -200px;
            margin-top: -200px;
          }
        }
        
        @keyframes scanline {
          0%, 100% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(300%);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}