import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, Phone, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function UserManagement() {
  const { allUsers, appointments } = useAppContext();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Foydalanuvchilar</h1>
          <p className="text-gray-600 mt-1">Ro'yxatdan o'tgan bemorlar</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Jami: {allUsers.length} ta foydalanuvchi
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {allUsers.map((u, i) => {
              const userApps = appointments.filter(a => a.patient === u.name);
              return (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={12} /> {u.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{userApps.length} ta qabul</p>
                    <p className="text-xs text-gray-500">Ro'yxatdan: {new Date(u.registeredAt).toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
              );
            })}
            {allUsers.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <User size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Hali hech qanday foydalanuvchi ro'yxatdan o'tmagan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
