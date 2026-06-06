import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import TopBar from './TopBar';
import { BottomNavBar } from './BottomNavBar';
import { ScrollToTop } from '../ui/ScrollToTop';
import { Footer } from './Footer';

export default function UserLayout({ showBottomNav = true, showBack = false, showNotif = true }) {
  return (
    <div className="bg-stone-50 min-h-screen w-full flex flex-col">
      {/* Top sticky app bar for desktop */}
      <TopNavBar />

      {/* Top sticky app bar for mobile */}
      <div className="lg:hidden">
        <TopBar showBack={showBack} showNotif={showNotif} />
      </div>

      {/* Main content area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer (Always visible, responsive) */}
      <Footer />

      {/* Bottom navigation bar (Mobile Only) */}
      {showBottomNav && (
        <div className="lg:hidden">
          <BottomNavBar />
        </div>
      )}
      
      {/* Scroll to Top FAB */}
      <ScrollToTop />
    </div>
  );
}
