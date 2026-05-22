import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, HeartPulse } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('demo@company.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-50 font-sans">
      
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-200">
              <HeartPulse className="text-rose-500 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Welcome back!</h1>
            <p className="text-stone-500 mt-2 text-base">We're glad to see you. Please sign in to access your HR dashboard.</p>
          </div>
          
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-stone-50/50 border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-stone-400"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-stone-50/50 border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-stone-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 mb-8">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-white border-stone-300 rounded text-rose-500 focus:ring-rose-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-stone-600">Remember me</label>
              </div>
              <a href="#" className="text-sm font-semibold text-rose-600 hover:text-rose-500 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 shadow-md shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-stone-500">
            For account issues, please contact your HR department.
          </div>
        </div>
      </div>

      {/* Right Graphic Side */}
      <div className="hidden lg:flex w-1/2 bg-rose-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Soft decorative background shapes */}
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        
        <div className="relative z-10 max-w-lg text-center backdrop-blur-sm bg-white/40 p-10 rounded-3xl border border-white/60 shadow-xl shadow-rose-900/5">
          <HeartPulse className="w-16 h-16 text-rose-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-stone-800 mb-4 leading-tight">Your workplace,<br/>simplified.</h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            Manage your leaves, check your benefits, and resolve queries effortlessly with our friendly HR AI Assistant.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
