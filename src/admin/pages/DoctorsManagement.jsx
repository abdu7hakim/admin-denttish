import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function DoctorsManagement() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const dayOptions = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

  const unknownColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    subspecialty: '',
    clinic: '',
    experience: '',
    patients: '',
    image: '',
    status: 'FAOL',
    workingHours: '09:00 - 18:00',
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
  });

  const { doctors, clinics, addDoctor, updateDoctor, deleteDoctor } = useAppContext();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && doctor.status === 'FAOL') ||
      (selectedFilter === 'inactive' && doctor.status === 'NOFAOL');
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateDoctor(editingId, formData);
      setEditingId(null);
    } else {
      addDoctor(formData);
    }
      setFormData({
        name: '',
        phone: '',
        specialization: '',
        subspecialty: '',
        clinic: '',
        experience: '',
        patients: '',
        image: '',
        status: 'FAOL',
        workingHours: '09:00 - 18:00',
        workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
      });
      setShowForm(false);
    };

    const handleEdit = (doctor) => {
      setFormData(doctor);
      setEditingId(doctor.id);
      setShowForm(true);
    };

  const handleDelete = (id) => {
    if (confirm('Haqiqatan ham o\'chirib tashlamoqchisiz?')) {
      deleteDoctor(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shifokorlar</h1>
            <p className="text-gray-600 mt-1">
              Klinika shifokorlarini boshqarish va taxtalar tizimini nazorat
            </p>
          </div>
          <button 
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: '',
                phone: '',
                specialization: '',
                subspecialty: '',
                clinic: '',
                experience: '',
                patients: '',
                image: '',
                status: 'FAOL',
                workingHours: '09:00 - 18:00',
                workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Yangi shifokor qo'shish
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingId ? 'Shifokorni tahrirlash' : 'Yangi shifokor qo\'shish'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ism"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-3">
                  <div className={`${formData.image ? '' : unknownColors[doctors.length % unknownColors.length]} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden`}>
                    {formData.image ? (
                      <img src={formData.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      formData.name ? formData.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Rasm URL (ixtiyoriy)"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mutaxassislik"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Sub-mutaxassislik"
                  value={formData.subspecialty}
                  onChange={(e) => setFormData({...formData, subspecialty: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.clinic}
                  onChange={(e) => setFormData({...formData, clinic: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Filialni tanlang</option>
                  {clinics.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Tajriba (masalan: 8 yil)"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Bemorlar (masalan: 1.2k+)"
                  value={formData.patients}
                  onChange={(e) => setFormData({...formData, patients: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Ish vaqti (masalan: 09:00 - 18:00)"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Ish kunlari</p>
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map(day => (
                      <label key={day} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.workingDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, workingDays: [...formData.workingDays, day]});
                            } else {
                              setFormData({...formData, workingDays: formData.workingDays.filter(d => d !== day)});
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FAOL">Faol</option>
                  <option value="NOFAOL">Nofaol</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Barcha shifokorlar</option>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header with avatar and menu */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`${doctor.avatarBg} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {doctor.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Doctor info */}
                <div className="space-y-2 mb-4 text-sm">
                  {doctor.subspecialty && (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">
                        Mutaxassislik:
                      </span>{' '}
                      {doctor.subspecialty}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Raqam:</span>{' '}
                    {doctor.phone}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">TAJRIBA</p>
                    <p className="text-lg font-bold text-gray-900">
                      {doctor.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs uppercase">BEMORLAR</p>
                    <p className="text-lg font-bold text-gray-900">
                      {doctor.patients}
                    </p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.status === 'FAOL'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doctor.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(doctor)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(doctor.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Shifokor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Mutaxassislik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Tajriba
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Bemorlar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Holat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${doctor.avatarBg} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {doctor.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doctor.name}
                          </p>
                          <p className="text-sm text-gray-500">{doctor.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {doctor.specialization}
                        </p>
                        {doctor.subspecialty && (
                          <p className="text-sm text-gray-500">
                            {doctor.subspecialty}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {doctor.experience}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {doctor.patients}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doctor.status === 'FAOL'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(doctor)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doctor.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              Qidiruv natijalariga mos shifokorlar topilmadi
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
