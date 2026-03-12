import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Building2, User, X, Mail, Lock, ArrowRight, Phone, Store } from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'store'>('user');
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'store') {
      const success = await login(email, password);
      if (success) {
        navigate('/store/dashboard');
      } else {
        setError('Invalid store credentials');
      }
    } else {
      if (email && password) {
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Please fill in all fields');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name && email && phone && signupPassword) {
      const success = await signup(name, email, phone, signupPassword);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('User already exists with this email');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans text-slate-200">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 p-8">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-slate-700">
             <Building2 className="text-violet-500" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Log in or create an account to get started.
        </p>

        {/* Tabs */}
        <div className="flex bg-[#1e293b] p-1 rounded-xl mb-8 relative">
          <button 
            onClick={() => { setActiveTab('user'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'user' ? 'bg-[#0f172a] text-white shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <User size={16} /> User
          </button>
          <button 
            onClick={() => { setActiveTab('store'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'store' ? 'bg-[#0f172a] text-white shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Store size={16} /> Store
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'store' ? "store@rapidrelief.com" : "Enter your email"}
                className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          {activeTab === 'store' && (
             <p className="text-xs text-slate-500 text-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
               Secure Store Portal Access Only.
             </p>
          )}

          <button 
            type="submit" 
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200 active:scale-95"
          >
            {activeTab === 'user' ? 'Login' : 'Store Login'}
          </button>

          {activeTab === 'user' && (
            <>
              <button 
                type="button"
                onClick={() => setShowSignup(true)}
                className="w-full bg-transparent border border-slate-700 hover:border-slate-500 text-white font-medium py-3.5 rounded-xl transition-all duration-200"
              >
                Create Account
              </button>

              <button 
                type="button"
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-1 text-slate-500 hover:text-white font-medium py-2 rounded-xl transition-colors text-sm mt-2"
              >
                Skip for now <ArrowRight size={14} />
              </button>
            </>
          )}

          <div className="text-center">
            <p className="text-xs text-slate-500 mt-4">
              By creating an account, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
            </p>
          </div>
        </form>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-slate-400 text-sm mb-6">Sign up to find your perfect medicines.</p>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-bold text-white mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button 
                type="submit" 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-600/20 mt-2 transition-all"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;