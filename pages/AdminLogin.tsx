import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, HeartPulse, Moon, Sun } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email && password) {
      const success = await login(email, password);
      if (success) {
        // useAuth login should handle the session. If it's an admin, go to dashboard.
        // We'll trust the isAdmin check in useEffect above or navigate here.
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 font-sans transition-colors duration-300">
      
      {/* Theme Toggle in Corner */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 hover:text-medical-600 transition-all active:scale-95"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-10 relative overflow-hidden">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-medical-500 rounded-2xl flex items-center justify-center shadow-lg shadow-medical-500/30 mb-4 transform hover:scale-105 transition-transform duration-300">
               <HeartPulse size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
               Rapid<span className="text-medical-500">Relief</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Admin Portal</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rapidrelief.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-medical-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-medical-500 hover:bg-medical-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-medical-500/30 transition-all duration-300 active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Admin Login
            </button>

            <div className="text-center pt-2">
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                 Secure Admin Portal Access Only. <br/> IP Logged.
               </p>
            </div>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-400 dark:text-slate-600 text-xs font-medium">
          &copy; 2026 RapidRelief Healthcare Systems
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;