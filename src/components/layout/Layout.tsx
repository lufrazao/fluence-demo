import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sparkles, Users, Brain, TrendingUp, Code } from 'lucide-react';

const NAV_TABS = [
  { to: '/', label: 'Demo Interativo', icon: Sparkles, end: true },
  { to: '/comparativo', label: 'Comparativo', icon: Users, end: false },
  { to: '/como-funciona', label: 'Como Funciona', icon: Brain, end: false },
  { to: '/impacto', label: 'Impacto', icon: TrendingUp, end: false },
  { to: '/api-explorer', label: 'API Explorer', icon: Code, end: false },
];

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Fluence"
            className="w-8 h-8 rounded-xl shadow-lg shadow-primary-500/30"
          />
          <span className="text-lg font-bold tracking-tight">Fluence</span>
          <span className="text-xs text-gray-500 ml-1">Conversão Inteligente</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400 text-xs">API Conectada</span>
          </div>
          <span className="text-xs text-gray-600">v2.5.0</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex border-b border-white/10 px-6">
        {NAV_TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <tab.icon size={16} />
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
