import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  ArrowUpRight,
  Settings,
  LogOut,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { logout, getStoredUser } from '../services/authService';
import { toast } from 'sonner';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getStoredUser();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Overview',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      name: 'Transactions',
      icon: <ArrowUpRight size={20} />,
      path: '/transactions',
    },
    { name: 'Budgets', icon: <PieChart size={20} />, path: '/budgets' },
    { name: 'Stages', icon: <TrendingUp size={20} />, path: '/stages' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-200 border-r border-slate-100 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Wallet size={20} />
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          FinTrack
        </span>
      </div>

      <div className="px-4 mb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl transition-all active:scale-[0.98] shadow-md font-semibold text-sm">
          <PlusCircle size={18} />
          Add Transaction
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
              ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-300 bg-slate-200">
        <div className="flex items-center gap-3 p-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
            {auth?.user.username.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">
              {auth?.user.username}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {auth?.user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-semibold text-sm group"
        >
          <LogOut
            size={18}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
