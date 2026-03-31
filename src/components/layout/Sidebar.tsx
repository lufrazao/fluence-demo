import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code, X, Sparkles, Users, Brain, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: Sparkles, label: 'Demo Interativo', path: '/' },
    { icon: Users, label: 'Comparativo', path: '/comparativo' },
    { icon: Brain, label: 'Como Funciona', path: '/como-funciona' },
    { icon: TrendingUp, label: 'Impacto', path: '/impacto' },
    { icon: Code, label: 'API Explorer', path: '/api-explorer' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-20 bg-gray-900/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={clsx(
          "fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Fluence" className="h-8 w-8 rounded-lg shadow-lg shadow-primary-500/30" />
            <span className="text-xl font-bold font-sans">Fluence</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                twMerge(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Modo Demo</p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span>API Conectada</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">v2.5.0 • Conversão Demo</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
