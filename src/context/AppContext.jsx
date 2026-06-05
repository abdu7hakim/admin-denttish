import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../api';

const AppContext = createContext();

const defaultSettings = {
  clinicName: 'DentTish Klinika',
  email: 'admin@denttish.uz',
  phone: '+998 71 200 00 00',
  address: 'Tashkent, Yunusobod tumani',
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  notificationsEmail: true,
  notificationsSms: true,
  notificationsPush: true,
  twoFactorAuth: false,
};

function loadLocal(key, fallback) {
  try {
    const saved = localStorage.getItem(`denttish_${key}`);
    if (saved) return JSON.parse(saved);
    return fallback;
  } catch { return fallback; }
}

function saveLocal(key, data) {
  try { localStorage.setItem(`denttish_${key}`, JSON.stringify(data)); } catch {}
}

export function AppProvider({ children }) {
  const [doctors, setDoctors] = useState(() => loadLocal('doctors', []));
  const [appointments, setAppointments] = useState(() => loadLocal('appointments', []));
  const [clinics, setClinics] = useState(() => loadLocal('clinics', []));
  const [clinicSettings, setClinicSettings] = useState(() => loadLocal('settings', defaultSettings));
  const [extraCategories, setExtraCategories] = useState(() => loadLocal('extraCategories', []));
  const [allUsers, setAllUsers] = useState(() => loadLocal('allUsers', []));
  const [adminNotifications, setAdminNotifications] = useState(() => loadLocal('adminNotifications', []));
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    inactiveDoctors: 0,
    totalAppointments: 0,
    totalClinics: 0,
    todayAppointments: 0,
  });

  // Sync state to local storage as fallback/cache
  useEffect(() => { saveLocal('doctors', doctors); }, [doctors]);
  useEffect(() => { saveLocal('appointments', appointments); }, [appointments]);
  useEffect(() => { saveLocal('clinics', clinics); }, [clinics]);
  useEffect(() => { saveLocal('settings', clinicSettings); }, [clinicSettings]);
  useEffect(() => { saveLocal('extraCategories', extraCategories); }, [extraCategories]);
  useEffect(() => { saveLocal('allUsers', allUsers); }, [allUsers]);
  useEffect(() => { saveLocal('adminNotifications', adminNotifications); }, [adminNotifications]);

  // Initial data loading from Backend API
  const refreshData = useCallback(() => {
    api.apiGetDoctors().then(data => { if (data) setDoctors(data); }).catch(() => {});
    api.apiGetAppointments().then(data => { if (data) setAppointments(data); }).catch(() => {});
    api.apiGetClinics().then(data => { if (data) setClinics(data); }).catch(() => {});
    api.apiGetSettings().then(data => { if (data) setClinicSettings(data); }).catch(() => {});
    api.apiGetCategories().then(data => { if (data) setExtraCategories(data); }).catch(() => {});
    api.apiGetUsers().then(data => { if (data) setAllUsers(data); }).catch(() => {});
    api.apiGetNotifications('admin').then(data => { if (data) setAdminNotifications(data); }).catch(() => {});
    api.apiGetStatistics().then(data => { if (data) setStats(data); }).catch(() => {});
  }, []);

  useEffect(() => {
    refreshData();
    // Poll for statistics and notifications every 15 seconds
    const interval = setInterval(() => {
      api.apiGetNotifications('admin').then(data => { if (data) setAdminNotifications(data); }).catch(() => {});
      api.apiGetStatistics().then(data => { if (data) setStats(data); }).catch(() => {});
      api.apiGetAppointments().then(data => { if (data) setAppointments(data); }).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Notifications
  const addAdminNotification = useCallback((message, type = 'info') => {
    const notif = { id: Date.now(), message, type, time: new Date().toISOString(), read: false };
    setAdminNotifications(prev => [notif, ...prev].slice(0, 50));
    // The backend handles notification addition during booking/crud automatically,
    // but we can have this here for local client notifications.
  }, []);

  const clearAdminNotification = useCallback((id) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== id));
    api.apiMarkRead(id).catch(() => {});
  }, []);

  const markAllAdminRead = useCallback(() => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
    api.apiMarkAllRead().catch(() => {});
  }, []);

  // Doctor CRUD
  const addDoctor = (doctor) => {
    const id = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    const initials = doctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase();
    const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];
    const avatarBg = bgColors[id % bgColors.length];
    const newDoctor = {
      ...doctor, id, avatar: initials, avatarBg,
      rating: parseFloat((4 + Math.random()).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 20,
      patients: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}k+`,
      distance: parseFloat((Math.random() * 5 + 0.5).toFixed(1)),
      verified: true,
      subspecialty: doctor.subspecialty || '',
      phone: doctor.phone || '',
      workingDays: doctor.workingDays || ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
      workingHours: doctor.workingHours || '09:00 - 18:00',
    };
    setDoctors([...doctors, newDoctor]);
    api.apiAddDoctor(newDoctor)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const updateDoctor = (id, updatedData) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, ...updatedData } : d));
    api.apiUpdateDoctor(id, updatedData)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const deleteDoctor = (id) => {
    setDoctors(doctors.filter(d => d.id !== id));
    api.apiDeleteDoctor(id)
      .then(() => refreshData())
      .catch(() => {});
  };

  // Appointment CRUD
  const addAppointment = (appointment) => {
    const id = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    const statusColors = {
      'Tasdiqlangan': 'bg-green-100 text-green-800',
      'Kutilmoqda': 'bg-yellow-100 text-yellow-800',
      'Yakunlandi': 'bg-blue-100 text-blue-800',
      'Bekor qilindi': 'bg-red-100 text-red-800',
    };
    const newAppointment = {
      ...appointment, id,
      initials: appointment.patient.split(' ').map(n => n[0]).join('').toUpperCase(),
      phone: appointment.phone || '',
      statusColor: statusColors[appointment.status] || statusColors['Kutilmoqda'],
    };
    setAppointments([...appointments, newAppointment]);
    api.apiAddAppointment(newAppointment)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const updateAppointment = (id, updatedData) => {
    const statusColors = {
      'Tasdiqlangan': 'bg-green-100 text-green-800',
      'Kutilmoqda': 'bg-yellow-100 text-yellow-800',
      'Yakunlandi': 'bg-blue-100 text-blue-800',
      'Bekor qilindi': 'bg-red-100 text-red-800',
    };
    setAppointments(appointments.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updatedData };
        updated.statusColor = statusColors[updated.status] || statusColors['Kutilmoqda'];
        return updated;
      }
      return a;
    }));
    api.apiUpdateAppointment(id, updatedData)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
    api.apiDeleteAppointment(id)
      .then(() => refreshData())
      .catch(() => {});
  };

  // Clinic CRUD
  const addClinic = (clinic) => {
    const id = clinics.length > 0 ? Math.max(...clinics.map(c => c.id)) + 1 : 1;
    const newClinic = { ...clinic, id, doctors: 0, rating: 4.5, reviews: 0, image: `https://api.dicebear.com/7.x/shapes/svg?seed=clinic${id}` };
    setClinics([...clinics, newClinic]);
    api.apiAddClinic(newClinic)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const updateClinic = (id, updatedData) => {
    setClinics(clinics.map(c => c.id === id ? { ...c, ...updatedData } : c));
    api.apiUpdateClinic(id, updatedData)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  const deleteClinic = (id) => {
    setClinics(clinics.filter(c => c.id !== id));
    api.apiDeleteClinic(id)
      .then(() => refreshData())
      .catch(() => {});
  };

  const updateClinicSettings = (settings) => {
    setClinicSettings({ ...clinicSettings, ...settings });
    api.apiUpdateSettings(settings)
      .then(data => { if (data) refreshData(); })
      .catch(() => {});
  };

  // Categories
  const categories = [...new Set([
    ...doctors.filter(d => d.status === 'FAOL').map(d => d.specialization),
    ...extraCategories,
  ])].filter(Boolean).sort();

  const doAddCategory = (name) => {
    if (name && !categories.includes(name)) {
      setExtraCategories([...extraCategories, name]);
      api.apiAddCategory(name)
        .then(() => refreshData())
        .catch(() => {});
    }
  };

  const doRemoveCategory = (name) => {
    const hasDoctor = doctors.some(d => d.specialization === name);
    if (!hasDoctor) {
      setExtraCategories(extraCategories.filter(c => c !== name));
      api.apiDeleteCategory(name)
        .then(() => refreshData())
        .catch(() => {});
    }
  };

  const getStatistics = () => stats;

  const value = {
    doctors, setDoctors, addDoctor, updateDoctor, deleteDoctor,
    appointments, setAppointments, addAppointment, updateAppointment, deleteAppointment,
    clinics, setClinics, addClinic, updateClinic, deleteClinic,
    clinicSettings, updateClinicSettings,
    categories, addCategory: doAddCategory, removeCategory: doRemoveCategory,
    getStatistics,
    // User system placeholders for admin context compatibility
    currentUser: null, setCurrentUser: () => {}, registerUser: () => {}, updateCurrentUser: () => {}, allUsers,
    // Notifications
    adminNotifications, addAdminNotification, clearAdminNotification, markAllAdminRead,
    userNotifications: [], addUserNotification: () => {}, clearUserNotification: () => {}, markUserNotificationRead: () => {},
    markAllUserNotificationsRead: () => {}, clearAllUserNotifications: () => {},
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
