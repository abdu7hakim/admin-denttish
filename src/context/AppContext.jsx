import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

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

const defaultClinics = [
  { id: 1, name: 'Lumina Dental Hub', address: 'Amir Temur ko\'chasi 45-uy, Tashkent', phone: '+998 71 123 45 67', hours: '09:00 - 21:00', services: ['UMUMIY', 'RENTGEN', 'IMPLANT'], image: 'https://api.dicebear.com/7.x/shapes/svg?seed=clinic1', doctors: 0, status: 'FAOL', rating: 4.8, reviews: 245, distance: 1.2 },
  { id: 2, name: 'DentTish Premium Clinic', address: 'Navoi ko\'chasi 12-uy, Tashkent', phone: '+998 71 234 56 78', hours: '08:00 - 22:00', services: ['UMUMIY', 'ORTODONTIYA', 'KOSMETIK'], image: 'https://api.dicebear.com/7.x/shapes/svg?seed=clinic2', doctors: 0, status: 'FAOL', rating: 4.9, reviews: 312, distance: 2.5 },
  { id: 3, name: 'SmileCare Dental Studio', address: 'Buyuk Ipak yo\'li 56-uy, Tashkent', phone: '+998 71 345 67 89', hours: '10:00 - 20:00', services: ['UMUMIY', 'PROTEZ', 'ENDODONTIYA'], image: 'https://api.dicebear.com/7.x/shapes/svg?seed=clinic3', doctors: 0, status: 'FAOL', rating: 4.7, reviews: 189, distance: 3.1 },
  { id: 4, name: 'Bright Smile Clinic', address: 'Mirabad tumani, Qo\'qon ko\'chasi 89-uy, Tashkent', phone: '+998 71 456 78 90', hours: '09:00 - 19:00', services: ['UMUMIY', 'RENTGEN'], image: 'https://api.dicebear.com/7.x/shapes/svg?seed=clinic4', doctors: 0, status: 'FAOL', rating: 4.6, reviews: 156, distance: 4.2 },
];

const seedDoctors = [
  {
    id: 1, name: 'Dr. Rustam Karimov', phone: '+998 90 123 45 67',
    specialization: 'Ortodont', subspecialty: 'Bolalar ortodontiyasi',
    clinic: 'Lumina Dental Hub', experience: '12 yil', patients: '3.5k+',
    status: 'FAOL', workingHours: '09:00 - 17:00',
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    avatar: 'RK', avatarBg: 'bg-blue-500', verified: true,
    rating: 4.9, reviews: 120, distance: 2.5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rustam',
  },
  {
    id: 2, name: 'Dr. Nilufar Azimova', phone: '+998 93 987 65 43',
    specialization: 'Terapevt', subspecialty: 'Estetik stomatologiya',
    clinic: 'DentTish Premium Clinic', experience: '8 yil', patients: '2.1k+',
    status: 'FAOL', workingHours: '10:00 - 18:00',
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Juma', 'Shanba'],
    avatar: 'NA', avatarBg: 'bg-green-500', verified: true,
    rating: 4.8, reviews: 95, distance: 1.2,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar',
  },
  {
    id: 3, name: 'Dr. Jahongir Sobirov', phone: '+998 97 111 22 33',
    specialization: 'Implantolog', subspecialty: 'Implant va protez',
    clinic: 'SmileCare Dental Studio', experience: '15 yil', patients: '4.2k+',
    status: 'FAOL', workingHours: '09:00 - 16:00',
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba'],
    avatar: 'JS', avatarBg: 'bg-red-500', verified: true,
    rating: 4.7, reviews: 78, distance: 3.1,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahongir',
  },
];

const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`denttish_${key}`);
    if (saved) return JSON.parse(saved);
    if (key === 'doctors' && !saved) {
      localStorage.setItem('denttish_doctors', JSON.stringify(seedDoctors));
      return seedDoctors;
    }
    return fallback;
  } catch { return fallback; }
};

export function AppProvider({ children }) {
  const [doctors, setDoctors] = useState(() => loadState('doctors', []));
  const [appointments, setAppointments] = useState(() => loadState('appointments', []));
  const [clinics, setClinics] = useState(() => loadState('clinics', defaultClinics));
  const [clinicSettings, setClinicSettings] = useState(() => loadState('settings', defaultSettings));
  const [lastBooking, setLastBooking] = useState(null);
  const [extraCategories, setExtraCategories] = useState(() => loadState('extraCategories', []));
  const [currentUser, setCurrentUser] = useState(() => loadState('currentUser', null));
  const [allUsers, setAllUsers] = useState(() => loadState('allUsers', []));
  const [adminNotifications, setAdminNotifications] = useState(() => loadState('adminNotifications', []));
  const [userNotifications, setUserNotifications] = useState(() => {
    const all = loadState('userNotifications', []);
    const cutoff = Date.now() - 86400000;
    const fresh = all.filter(n => new Date(n.time).getTime() > cutoff);
    if (fresh.length !== all.length) localStorage.setItem('denttish_userNotifications', JSON.stringify(fresh));
    return fresh.slice(0, 20);
  });

  useEffect(() => { localStorage.setItem('denttish_doctors', JSON.stringify(doctors)) }, [doctors]);
  useEffect(() => { localStorage.setItem('denttish_appointments', JSON.stringify(appointments)) }, [appointments]);
  useEffect(() => { localStorage.setItem('denttish_clinics', JSON.stringify(clinics)) }, [clinics]);
  useEffect(() => { localStorage.setItem('denttish_settings', JSON.stringify(clinicSettings)) }, [clinicSettings]);
  useEffect(() => { localStorage.setItem('denttish_extraCategories', JSON.stringify(extraCategories)) }, [extraCategories]);
  useEffect(() => { localStorage.setItem('denttish_currentUser', JSON.stringify(currentUser)) }, [currentUser]);
  useEffect(() => { localStorage.setItem('denttish_allUsers', JSON.stringify(allUsers)) }, [allUsers]);
  useEffect(() => { localStorage.setItem('denttish_adminNotifications', JSON.stringify(adminNotifications)) }, [adminNotifications]);
  useEffect(() => { localStorage.setItem('denttish_userNotifications', JSON.stringify(userNotifications)) }, [userNotifications]);

  // Notifications
  const addAdminNotification = useCallback((message, type = 'info') => {
    const notif = { id: Date.now(), message, type, time: new Date().toISOString(), read: false };
    setAdminNotifications(prev => [notif, ...prev].slice(0, 50));
  }, []);

  const clearAdminNotification = useCallback((id) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllAdminRead = useCallback(() => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addUserNotification = useCallback((message, type = 'info') => {
    const notif = { id: Date.now(), message, type, time: new Date().toISOString(), read: false };
    setUserNotifications(prev => [notif, ...prev].slice(0, 50));
  }, []);

  const clearUserNotification = useCallback((id) => {
    setUserNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markUserNotificationRead = useCallback((id) => {
    setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllUserNotificationsRead = useCallback(() => {
    setUserNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAllUserNotifications = useCallback(() => {
    setUserNotifications([]);
    localStorage.setItem('denttish_userNotifications', '[]');
  }, []);

  // User registration
  const registerUser = useCallback((name, phone) => {
    const user = { name, phone, registeredAt: new Date().toISOString() };
    setCurrentUser(user);
    setAllUsers(prev => {
      if (prev.some(u => u.name === name && u.phone === phone)) return prev;
      return [...prev, user];
    });
    addUserNotification(`Xush kelibsiz, ${name}! DentTish ilovasiga muvaffaqiyatli ro'yxatdan o'tdingiz.`, 'welcome');
  }, [addUserNotification]);

  const updateCurrentUser = useCallback((name, phone) => {
    setCurrentUser(prev => {
      const updated = { ...prev, name, phone };
      return updated;
    });
    setAllUsers(prev => prev.map(u =>
      u.name === currentUser?.name && u.phone === currentUser?.phone
        ? { ...u, name, phone }
        : u
    ));
  }, [currentUser]);

  // Doctor CRUD (with notifications)
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
    addAdminNotification(`Yangi shifokor qo'shildi: ${newDoctor.name}`, 'doctor_add');
  };

  const updateDoctor = (id, updatedData) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, ...updatedData } : d));
  };

  const deleteDoctor = (id) => {
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      addAdminNotification(`Shifokor ishdan olindi: ${doc.name}`, 'doctor_remove');
    }
    setDoctors(doctors.filter(d => d.id !== id));
  };

  // Appointment CRUD (with user notification)
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
    setLastBooking(newAppointment);
    addUserNotification(`Siz ${appointment.doctor} qabuliga yozildingiz (${appointment.date}, ${appointment.time})`, 'booking');
    addAdminNotification(`${appointment.patient} ${appointment.doctor} qabuliga yozildi`, 'booking');
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
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  // Clinic CRUD
  const addClinic = (clinic) => {
    const id = clinics.length > 0 ? Math.max(...clinics.map(c => c.id)) + 1 : 1;
    const newClinic = { ...clinic, id, doctors: 0, rating: 4.5, reviews: 0, image: `https://api.dicebear.com/7.x/shapes/svg?seed=clinic${id}` };
    setClinics([...clinics, newClinic]);
  };

  const updateClinic = (id, updatedData) => {
    setClinics(clinics.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteClinic = (id) => {
    setClinics(clinics.filter(c => c.id !== id));
  };

  const updateClinicSettings = (settings) => {
    setClinicSettings({ ...clinicSettings, ...settings });
  };

  // Categories
  const categories = [...new Set([
    ...doctors.filter(d => d.status === 'FAOL').map(d => d.specialization),
    ...extraCategories,
  ])].filter(Boolean).sort();

  const doAddCategory = (name) => {
    if (name && !categories.includes(name)) {
      setExtraCategories([...extraCategories, name]);
    }
  };

  const doRemoveCategory = (name) => {
    const hasDoctor = doctors.some(d => d.specialization === name);
    if (!hasDoctor) {
      setExtraCategories(extraCategories.filter(c => c !== name));
    }
  };

  const getStatistics = () => ({
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter(d => d.status === 'FAOL').length,
    inactiveDoctors: doctors.filter(d => d.status === 'NOFAOL').length,
    totalAppointments: appointments.length,
    totalClinics: clinics.length,
    todayAppointments: appointments.filter(a => a.status === 'Tasdiqlangan').length,
  });

  const value = {
    doctors, setDoctors, addDoctor, updateDoctor, deleteDoctor,
    appointments, setAppointments, addAppointment, updateAppointment, deleteAppointment,
    clinics, setClinics, addClinic, updateClinic, deleteClinic,
    clinicSettings, updateClinicSettings,
    lastBooking, setLastBooking,
    categories, addCategory: doAddCategory, removeCategory: doRemoveCategory,
    getStatistics,
    // User system
    currentUser, setCurrentUser, registerUser, updateCurrentUser, allUsers,
    // Notifications
    adminNotifications, addAdminNotification, clearAdminNotification, markAllAdminRead,
    userNotifications, addUserNotification, clearUserNotification, markUserNotificationRead,
    markAllUserNotificationsRead, clearAllUserNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
