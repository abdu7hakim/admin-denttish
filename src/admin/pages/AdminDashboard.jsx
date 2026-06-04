import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  Users,
  Calendar,
  Stethoscope,
  TrendingUp,
  MoreVertical,
  Edit,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminDashboard() {
  const { doctors, appointments, getStatistics } = useAppContext();
  const stats = getStatistics();

  const [reviews] = useState([
    {
      id: 1,
      patient: 'Aziza T.',
      comment: 'Uyali shifokor, amaliyot zo\'r!',
      rating: '5.0/5',
      time: 'Bugun',
    },
    {
      id: 2,
      patient: 'Rustam K.',
      comment: 'Shifokor va jamoasi juda xushmuamala.',
      rating: '5.0/5',
      time: 'Kecha',
    },
    {
      id: 3,
      patient: 'Malika P.',
      comment: 'Tez va samarali xizmat!',
      rating: '4.5/5',
      time: 'Ikkishanba',
    },
  ]);

  return (
    <AdminLayout adminName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Xush kelibsiz, Admin! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Bugungi klinika holati va asosiy ko'rsatkichlar
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bugungi qabullar */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg w-fit">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Bugungi qabullar</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {appointments.length}
              </span>
              <span className="text-sm text-green-600 font-medium">Jami</span>
            </div>
          </div>

          {/* Faol shifokorlar */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg w-fit">
                <Stethoscope className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Faol shifokorlar</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {doctors.filter(d => d.status === 'FAOL').length}
              </span>
              <span className="text-sm text-green-600 font-medium">/{doctors.length} jami</span>
            </div>
          </div>

          {/* Nofaol shifokorlar */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg w-fit">
                <Users className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Nofaol shifokorlar</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {doctors.filter(d => d.status === 'NOFAOL').length}
              </span>
              <span className="text-sm text-yellow-600 font-medium">Tasdiqlanmagan</span>
            </div>
          </div>

          {/* Jami shifokorlar */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg w-fit">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Jami shifokorlar</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {doctors.length}
              </span>
              <span className="text-sm text-purple-600 font-medium">Tizimda</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                So'nggi yozuvlar
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Bugungi kun uchun belgilangan va kuzatish yozuvlari va kattiqlashtirilgan yozuvlarni
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Bemor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Shifokor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Vaqt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Holat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 3).map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {appointment.patient}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.statusColor}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <a
                href="/admin/appointments"
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Barcha yozuvlarni ko'rish
              </a>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Bildirrishnomalar
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
                      <span className="text-xs font-semibold">
                        {review.patient}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="text-yellow-500 font-medium">
                      {review.rating}
                    </span>
                    {review.time && <span>{review.time}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <a
                href="#"
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Barcha yozuvlarni ko'rish
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
