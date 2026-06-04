import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, Stethoscope } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function CategoriesManagement() {
  const { categories, doctors, addCategory, removeCategory } = useAppContext();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      addCategory(trimmed);
      setNewName('');
    }
  };

  const doctorCount = (spec) => doctors.filter(d => d.specialization === spec).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Yo'nalishlar</h1>
          <p className="text-gray-600 mt-1">Shifokor mutaxassisliklarini boshqarish</p>
        </div>

        {/* Add new */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Yangi yo'nalish qo'shish</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Yo'nalish nomi (masalan: Ortodont)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Qo'shish
            </button>
          </div>
        </div>

        {/* Categories list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Barcha yo'nalishlar ({categories.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {categories.map((cat) => {
              const count = doctorCount(cat);
              const hasDoctors = count > 0;
              return (
                <div key={cat} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Stethoscope size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cat}</p>
                      <p className="text-sm text-gray-500">{count} ta shifokor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDoctors && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Shifokorlar bilan bog'liq
                      </span>
                    )}
                    {!hasDoctors && (
                      <button
                        onClick={() => removeCategory(cat)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <p>Hali hech qanday yo'nalish mavjud emas</p>
                <p className="text-sm mt-1">Yuqorida yangi yo'nalish qo'shing yoki shifokor qo'shganda avtomatik qo'shiladi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
