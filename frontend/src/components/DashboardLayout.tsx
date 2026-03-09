import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Shared layout wrapper for all authenticated pages.
 *
 * Renders the `Sidebar` navigation alongside the active page content.
 * Child route components are injected via `<Outlet />`.
 */
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
