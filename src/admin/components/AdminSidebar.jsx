import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    {
      label: 'Boshqaruv paneli',
      icon: BarChart3,
      path: '/admin/dashboard',
      key: 'dashboard',
    },
    {
      label: 'Shifokorlar',
      icon: Users,
      path: '/admin/doctors',
      key: 'doctors',
    },
    {
      label: 'Qabullar',
      icon: Calendar,
      path: '/admin/appointments',
      key: 'appointments',
    },
    {
      label: 'Yo\'nalishlar',
      icon: Stethoscope,
      path: '/admin/categories',
      key: 'categories',
    },
    {
      label: 'Foydalanuvchilar',
      icon: Users,
      path: '/admin/users',
      key: 'users',
    },
    {
      label: 'Sozlamalar',
      icon: Settings,
      path: '/admin/settings',
      key: 'settings',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white w-64 transform transition-transform duration-300 z-50 md:relative md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 md:hidden"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">DentTish</h1>
          <p className="text-blue-100 text-sm">Klinika boshqaruvi</p>
        </div>

        {/* Menu items */}
        <nav className="flex-1 py-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  active
                    ? 'bg-blue-500 border-r-4 border-white'
                    : 'hover:bg-blue-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-6 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}
