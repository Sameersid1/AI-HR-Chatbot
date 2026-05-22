import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-sm">
               <HeartPulse className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-stone-800 leading-none block">HR Connect</span>
              <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">{user?.role} Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-stone-700">
              <div className="bg-stone-100 p-1.5 rounded-full border border-stone-200">
                <UserIcon size={16} className="text-stone-600" />
              </div>
              <span className="text-sm font-semibold hidden sm:block">{user?.name}</span>
            </div>
            
            <div className="h-6 w-px bg-stone-200"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-medium text-stone-500 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
