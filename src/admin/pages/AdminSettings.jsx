import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Save, Bell, Lock, Users, Globe } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminSettings() {
  const { clinicSettings, updateClinicSettings } = useAppContext();
  const [settings, setSettings] = useState(clinicSettings);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = () => {
    updateClinicSettings(settings);
    alert('Sozlamalar saqlandi!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sozlamalar</h1>
          <p className="text-gray-600 mt-1">
            Klinika sozlamalari va xavfsizlik parametrlarini boshqaring
          </p>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Globe size={24} className="text-blue-600" />
            Umumiy sozlamalar
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klinika nomi
                </label>
                <input
                  type="text"
                  value={settings.clinicName}
                  onChange={(e) => handleChange('clinicName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manzil
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ish vaqti (Boshlanish)
                </label>
                <input
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={(e) =>
                    handleChange('workingHoursStart', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ish vaqti (Tugash)
                </label>
                <input
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={(e) => handleChange('workingHoursEnd', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Bell size={24} className="text-yellow-600" />
            Bildirishnomalar
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email orqali</p>
                <p className="text-sm text-gray-600">
                  Muhim xabarlarni email orqali qabul qiling
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsEmail}
                onChange={(e) =>
                  handleChange('notificationsEmail', e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SMS orqali</p>
                <p className="text-sm text-gray-600">
                  Tezkor xabarlarni SMS orqali qabul qiling
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsSms}
                onChange={(e) =>
                  handleChange('notificationsSms', e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Push-bildirishnomalar</p>
                <p className="text-sm text-gray-600">
                  Dasturga push-bildirishnomalarni qabul qiling
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsPush}
                onChange={(e) =>
                  handleChange('notificationsPush', e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Lock size={24} className="text-red-600" />
            Xavfsizlik
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Ikki bosqichli tasdiqlash
                </p>
                <p className="text-sm text-gray-600">
                  Akkauntni xavfsizlik uchun faollashtiring
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Parolni o'zgartirish
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save size={20} />
            Saqlash
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
