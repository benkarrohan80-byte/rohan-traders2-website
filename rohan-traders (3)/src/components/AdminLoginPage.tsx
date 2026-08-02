import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowLeft, Recycle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/scrapCategories';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate subtle network lag for realistic, premium professional experience
    setTimeout(() => {
      if (username.trim() === 'rohan123' && password === '#rohan123') {
        onLoginSuccess();
      } else {
        setError('Invalid Username or Password');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-orange-50/30 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Back Button */}
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 sm:p-10 my-8 space-y-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

        <div className="text-center space-y-4">
          <div className="inline-flex bg-orange-500 text-white p-3.5 rounded-2xl shadow-lg shadow-orange-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rohan Traders Admin</h2>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Secure Security Portal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin username"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold text-gray-900 placeholder:text-gray-400 transition-all bg-gray-50/50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold text-gray-900 placeholder:text-gray-400 tracking-wide transition-all bg-gray-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/10 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Access Admin Control</span>
              </>
            )}
          </button>
        </form>

        {/* Access Denied Warning Footer */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            This workspace is monitored and encrypted. Unauthorized access attempts will be blocked.
          </p>
        </div>
      </div>

      {/* Corporate Copy */}
      <div className="text-center text-xs text-gray-400 font-medium">
        © 2026 {COMPANY_DETAILS.name}. All Rights Reserved.
      </div>
    </div>
  );
};
