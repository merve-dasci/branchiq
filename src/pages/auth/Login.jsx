import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice.js';
import { UtensilsCrossed, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear auth errors when navigating to the page
  useEffect(() => {
    dispatch(clearError());
    setValidationError('');
  }, [dispatch]);

  // Handle post-login role-based routing redirects
  useEffect(() => {
    if (user) {
      if (user.role === 'superAdmin') {
        navigate('/super-admin/dashboard');
      } else if (user.role === 'branchAdmin') {
        navigate('/branch-admin/dashboard');
      } else if (user.role === 'operationAdmin') {
        navigate('/operation/kitchen');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setValidationError('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Email must be a valid email format.');
      return;
    }
    if (!password) {
      setValidationError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setValidationError('');
    dispatch(loginUser({ email, password }));
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setValidationError('');
    dispatch(clearError());
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decorative ambient blurred shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10">
          
          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 text-white mb-4">
              <UtensilsCrossed size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">BranchIQ</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">{t('login_subtitle')}</p>
          </div>

          {/* Error Prompt */}
          {(error || validationError) && (
            <div id="login-error-alert" className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-xs text-rose-700 font-semibold animate-shake">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">{t('login_error_title')}</p>
                <p className="font-medium text-rose-600/80 mt-0.5">{error || validationError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">{t('email_placeholder')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="login-email-input"
                  type="text"
                  placeholder="name@branchiq.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError('');
                    dispatch(clearError());
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t('password_placeholder')}</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationError('');
                    dispatch(clearError());
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 font-semibold"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/15 transition-all mt-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{t('login_btn')}</span>
              )}
            </button>

          </form>

          {/* Quick Demo Accents Block */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">{t('demo_accounts')}</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="demo-superadmin-btn"
                type="button"
                onClick={() => handleDemoFill('superadmin@branchiq.com', '123456')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-center transition-all cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-slate-800">Super Admin</p>
                <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">superadmin@branchiq.com</p>
              </button>

              <button
                id="demo-branchadmin-btn"
                type="button"
                onClick={() => handleDemoFill('branchadmin@branchiq.com', '123456')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-center transition-all cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-slate-800">Branch Admin</p>
                <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">branchadmin@branchiq.com</p>
              </button>

              <button
                id="demo-operationadmin-btn"
                type="button"
                onClick={() => handleDemoFill('operation@branchiq.com', '123456')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-center transition-all cursor-pointer"
              >
                <p className="text-[10px] font-extrabold text-slate-800">Operation Admin</p>
                <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">operation@branchiq.com</p>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Credit line */}
        <p className="text-center text-slate-500 text-[10px] font-bold mt-6 tracking-wide">
          BranchIQ Operational Suite • SMAH Technologies
        </p>

      </div>
    </div>
  );
}
