import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, X, CheckCircle, UserPlus, UserMinus, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const iconMap = {
  doctor_add: UserPlus,
  doctor_remove: UserMinus,
  booking: Calendar,
};

const colorMap = {
  doctor_add: 'text-green-600 bg-green-100',
  doctor_remove: 'text-red-600 bg-red-100',
  booking: 'text-blue-600 bg-blue-100',
};

export default function AdminHeader({ toggleSidebar, adminName = 'Admin' }) {
  const { adminNotifications, clearAdminNotification, markAllAdminRead } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = adminNotifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-semibold text-gray-800 flex-1 md:flex-none md:ml-0 ml-4">
          DentTish Admin
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                  <span className="font-bold text-gray-800">Bildirishnomalar</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllAdminRead} className="text-xs text-blue-600 hover:underline">Hammasini o'qilgan deb belgilash</button>
                  )}
                </div>
                {adminNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Bildirishnomalar mavjud emas</div>
                ) : (
                  adminNotifications.map(n => {
                    const Icon = iconMap[n.type] || Bell;
                    const color = colorMap[n.type] || 'text-gray-600 bg-gray-100';
                    return (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-100 flex gap-3 items-start ${!n.read ? 'bg-blue-50' : ''}`}>
                        <div className={`p-2 rounded-full ${color} flex-shrink-0`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(n.time).toLocaleString('uz-UZ')}</p>
                        </div>
                        <button onClick={() => clearAdminNotification(n.id)} className="text-gray-300 hover:text-gray-600 flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{adminName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
