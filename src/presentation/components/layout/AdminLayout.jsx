import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, User, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex font-sans">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-50">
        <AdminSidebar />
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Modern Admin Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-600 lg:hidden transition-all"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-stone-50 rounded-2xl border border-stone-100 w-80 group focus-within:border-primary-200 transition-all">
              <Search size={18} className="text-stone-400 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder-stone-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 hover:text-primary-600 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 border-2 border-white" />
            </button>

            <div className="h-8 w-px bg-stone-100 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-stone-900 leading-none mb-1">
                  {storedUser?.nama || 'Administrator'}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] font-black text-primary-600 uppercase tracking-widest">
                  <ShieldCheck size={10} />
                  <span>Super Admin</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xl">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="p-8 md:p-12 flex-1 max-w-7xl w-full mx-auto pb-32">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
