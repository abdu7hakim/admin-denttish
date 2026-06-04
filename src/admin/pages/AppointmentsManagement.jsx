import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAppContext } from '../../context/AppContext';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';

export default function AppointmentsManagement() {
  const { doctors, appointments, updateAppointment, deleteAppointment } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    clinic: '',
    date: '',
    time: '',
    status: 'Kutilmoqda',
  });

  const statusColors = {
    'Tasdiqlangan': 'bg-green-100 text-green-800',
    'Kutilmoqda': 'bg-yellow-100 text-yellow-800',
    'Yakunlandi': 'bg-blue-100 text-blue-800',
    'Bekor qilindi': 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    'Tasdiqlangan': CheckCircle,
    'Kutilmoqda': Clock,
    'Yakunlandi': CheckCircle,
    'Bekor qilindi': X,
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (appointment) => {
    setEditingId(appointment.id);
    setFormData({
      patient: appointment.patient,
      phone: appointment.phone || '',
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAppointment(editingId, { status: formData.status });
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Haqiqatan ham bu qabulni o\'chirib tashlamoqchisiz?')) {
      deleteAppointment(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Qabullar</h1>
            <p className="text-gray-600 mt-1">
              Barcha uchrashuvlarni boshqarish va kuzatish
            </p>
          </div>
          <span className="text-sm text-gray-500">Qabullar faqat bemorlar tomonidan yaratiladi</span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Bemor yoki shifokor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Doctor filter */}
            <div>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Barcha shifokorlar</option>
                {doctors.map(doc => (
                  <option key={doc.id}>{doc.name}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Barcha holatlari</option>
                <option value="Tasdiqlangan">Tasdiqlangan</option>
                <option value="Kutilmoqda">Kutilmoqda</option>
                <option value="Yakunlandi">Yakunlandi</option>
                <option value="Bekor qilindi">Bekor qilindi</option>
              </select>
            </div>

            {/* Date filter */}
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <Download size={20} />
            Excelga yuklash
          </button>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Bemor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Shifokor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Filial
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">
                    Sana va Vaqt
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
                {filteredAppointments.map((appointment) => {
                  const StatusIcon = statusIcons[appointment.status] || Clock;
                  return (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(appointment.patient)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {appointment.patient}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {appointment.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {appointment.clinic}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar size={16} className="text-gray-500" />
                          <span>
                            {appointment.date}
                            <br />
                            <span className="text-sm text-gray-500">
                              {appointment.time}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={16} />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(appointment)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-blue-600"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Jami: {filteredAppointments.length} ta uchrashuvlar
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                ←
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Qabul ma'lumotlari
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Bemor:</span> {formData.patient}</div>
                    <div><span className="font-medium text-gray-700">Telefon:</span> {formData.phone || '-'}</div>
                    <div><span className="font-medium text-gray-700">Shifokor:</span> {formData.doctor}</div>
                    <div><span className="font-medium text-gray-700">Sana:</span> {formData.date}</div>
                    <div><span className="font-medium text-gray-700">Vaqt:</span> {formData.time}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Holatni o'zgartirish
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Tasdiqlangan">Tasdiqlangan</option>
                      <option value="Kutilmoqda">Kutilmoqda</option>
                      <option value="Yakunlandi">Yakunlandi</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Yopish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
