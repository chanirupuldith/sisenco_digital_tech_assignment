import React, { useState } from 'react'; // Added useState
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  ArrowUpRight,
  LogOut,
  PlusCircle,
  Tag,
  Menu, // Added for mobile toggle
  X, // Added for mobile close
} from 'lucide-react';
import { logout, getStoredUser } from '../services/authService';
import { toast } from 'sonner';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getStoredUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: 'Categories', icon: <Tag size={20} />, path: '/categories' },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Wallet size={18} />
          </div>
          <span className="font-bold text-slate-900">FinTrack</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-200 border-r border-slate-300 flex flex-col transition-transform duration-300 transform
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-500"
        >
          <X size={20} />
        </button>

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
              onClick={() => setIsMobileMenuOpen(false)} // Close on click for mobile
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-300">
          <div className="flex items-center gap-3 p-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shrink-0">
              {auth?.user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {auth?.user.username}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
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
    </>
  );
};

export default Sidebar;
