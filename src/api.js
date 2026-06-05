import { db } from './firebase/config';
import {
  collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, query, where
} from 'firebase/firestore';

const COLLECTIONS = {
  doctors: 'doctors',
  appointments: 'appointments',
  users: 'users',
  clinics: 'clinics',
  categories: 'categories',
  notifications: 'notifications',
  settings: 'settings'
};

function docToObj(d) {
  const data = d.data();
  return { id: isNaN(Number(d.id)) ? d.id : Number(d.id), ...data };
}

const TOKEN_KEY = 'adminToken';
function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getAdminToken() { return getToken(); }

export const apiAdminLogin = (username, password) => {
  return new Promise((resolve) => {
    if (username === 'admin' && password === 'admin3379') {
      const token = btoa(`admin:${Date.now()}`);
      localStorage.setItem(TOKEN_KEY, token);
      resolve({ token, admin: { name: 'Admin' } });
    } else {
      resolve(null);
    }
  });
};

export const apiGetDoctors = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.doctors));
    return snap.docs.map(docToObj);
  } catch { return null; }
};

export const apiAddDoctor = async (data) => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.doctors));
    const doctors = snap.docs.map(docToObj);
    const id = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    const initials = data.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase();
    const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];
    const doctor = {
      ...data, id, avatar: initials, avatarBg: bgColors[id % bgColors.length],
      rating: parseFloat((4 + Math.random()).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 20,
      patients: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}k+`,
      verified: true, subspecialty: data.subspecialty || '', phone: data.phone || '',
      workingDays: data.workingDays || ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
      workingHours: data.workingHours || '09:00 - 18:00',
    };
    await setDoc(doc(db, COLLECTIONS.doctors, String(id)), doctor);
    return doctor;
  } catch { return null; }
};

export const apiUpdateDoctor = async (id, data) => {
  try {
    const ref = doc(db, COLLECTIONS.doctors, String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const updated = { ...snap.data(), ...data, id: snap.data().id };
    await setDoc(ref, updated);
    return updated;
  } catch { return null; }
};

export const apiDeleteDoctor = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.doctors, String(id)));
    return { ok: true };
  } catch { return null; }
};

export const apiGetAppointments = async (phone) => {
  try {
    let snap;
    if (phone) {
      const q = query(collection(db, COLLECTIONS.appointments), where('phone', '==', phone));
      snap = await getDocs(q);
    } else {
      snap = await getDocs(collection(db, COLLECTIONS.appointments));
    }
    return snap.docs.map(docToObj);
  } catch { return null; }
};

export const apiAddAppointment = async (data) => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.appointments));
    const appointments = snap.docs.map(docToObj);
    const id = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    const statusColors = {
      'Tasdiqlangan': 'bg-green-100 text-green-800', 'Kutilmoqda': 'bg-yellow-100 text-yellow-800',
      'Yakunlandi': 'bg-blue-100 text-blue-800', 'Bekor qilindi': 'bg-red-100 text-red-800'
    };
    const appointment = {
      ...data, id,
      initials: data.patient.split(' ').map(n => n[0]).join('').toUpperCase(),
      phone: data.phone || '',
      statusColor: statusColors[data.status] || statusColors['Kutilmoqda']
    };
    await setDoc(doc(db, COLLECTIONS.appointments, String(id)), appointment);

    const adminNotif = { id: Date.now(), message: `${appointment.patient} → ${appointment.doctor} (${appointment.date}, ${appointment.time})`, type: 'booking', time: new Date().toISOString(), read: false, target: 'admin' };
    await setDoc(doc(db, COLLECTIONS.notifications, String(adminNotif.id)), adminNotif);
    const userNotif = { id: Date.now() + 1, message: `Siz ${appointment.doctor} qabuliga yozildingiz (${appointment.date}, ${appointment.time})`, type: 'booking', time: new Date().toISOString(), read: false, target: appointment.phone };
    await setDoc(doc(db, COLLECTIONS.notifications, String(userNotif.id)), userNotif);

    return appointment;
  } catch { return null; }
};

export const apiUpdateAppointment = async (id, data) => {
  try {
    const ref = doc(db, COLLECTIONS.appointments, String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const statusColors = {
      'Tasdiqlangan': 'bg-green-100 text-green-800', 'Kutilmoqda': 'bg-yellow-100 text-yellow-800',
      'Yakunlandi': 'bg-blue-100 text-blue-800', 'Bekor qilindi': 'bg-red-100 text-red-800'
    };
    const updated = { ...snap.data(), ...data, statusColor: statusColors[data.status] || snap.data().statusColor };
    await setDoc(ref, updated);
    return updated;
  } catch { return null; }
};

export const apiDeleteAppointment = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.appointments, String(id)));
    return { ok: true };
  } catch { return null; }
};

export const apiGetUsers = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.users));
    return snap.docs.map(docToObj);
  } catch { return null; }
};

export const apiGetNotifications = async (target) => {
  try {
    let q = collection(db, COLLECTIONS.notifications);
    if (target) q = query(q, where('target', '==', target));
    const snap = await getDocs(q);
    const notifications = snap.docs.map(docToObj);
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    return notifications;
  } catch { return null; }
};

export const apiMarkRead = async (id) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.notifications, String(id)), { read: true });
    return { ok: true };
  } catch { return null; }
};

export const apiMarkAllRead = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.notifications));
    for (const d of snap.docs) {
      if (!d.data().read) await updateDoc(doc(db, COLLECTIONS.notifications, d.id), { read: true });
    }
    return { ok: true };
  } catch { return null; }
};

export const apiGetSettings = async () => {
  try {
    const ref = doc(db, COLLECTIONS.settings, 'clinic');
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    const defaults = {
      clinicName: 'DentTish Klinika', email: 'admin@denttish.uz', phone: '+998 71 200 00 00',
      address: 'Tashkent, Yunusobod tumani', workingHoursStart: '09:00', workingHoursEnd: '18:00',
      notificationsEmail: true, notificationsSms: true, notificationsPush: true, twoFactorAuth: false,
    };
    await setDoc(ref, defaults);
    return defaults;
  } catch { return null; }
};

export const apiUpdateSettings = async (data) => {
  try {
    const ref = doc(db, COLLECTIONS.settings, 'clinic');
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return snap.data();
  } catch { return null; }
};

export const apiGetCategories = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.categories));
    return snap.docs.map(d => d.id);
  } catch { return null; }
};

export const apiAddCategory = async (name) => {
  try {
    await setDoc(doc(db, COLLECTIONS.categories, name), { name });
    const snap = await getDocs(collection(db, COLLECTIONS.categories));
    return snap.docs.map(d => d.id);
  } catch { return null; }
};

export const apiDeleteCategory = async (name) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.categories, name));
    const snap = await getDocs(collection(db, COLLECTIONS.categories));
    return snap.docs.map(d => d.id);
  } catch { return null; }
};

export const apiGetStatistics = async () => {
  try {
    const [doctorsSnap, appointmentsSnap, clinicsSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.doctors)),
      getDocs(collection(db, COLLECTIONS.appointments)),
      getDocs(collection(db, COLLECTIONS.clinics))
    ]);
    const doctors = doctorsSnap.docs.map(docToObj);
    const appointments = appointmentsSnap.docs.map(docToObj);
    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter(d => d.status === 'FAOL').length,
      inactiveDoctors: doctors.filter(d => d.status === 'NOFAOL').length,
      totalAppointments: appointments.length,
      totalClinics: clinicsSnap.size,
      todayAppointments: appointments.filter(a => a.status === 'Tasdiqlangan').length,
    };
  } catch { return null; }
};

export const apiGetClinics = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.clinics));
    return snap.docs.map(docToObj);
  } catch { return null; }
};

export const apiAddClinic = async (data) => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.clinics));
    const clinics = snap.docs.map(docToObj);
    const id = clinics.length > 0 ? Math.max(...clinics.map(c => c.id)) + 1 : 1;
    const clinic = {
      ...data, id, image: `https://api.dicebear.com/7.x/shapes/svg?seed=clinic${id}`,
      doctors: 0, rating: 4.5, reviews: 0
    };
    await setDoc(doc(db, COLLECTIONS.clinics, String(id)), clinic);
    return clinic;
  } catch { return null; }
};

export const apiUpdateClinic = async (id, data) => {
  try {
    const ref = doc(db, COLLECTIONS.clinics, String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const updated = { ...snap.data(), ...data, id: snap.data().id };
    await setDoc(ref, updated);
    return updated;
  } catch { return null; }
};

export const apiDeleteClinic = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.clinics, String(id)));
    return { ok: true };
  } catch { return null; }
};

export const apiRegister = async (name, phone) => {
  try {
    const q = query(collection(db, COLLECTIONS.users), where('phone', '==', phone));
    const snap = await getDocs(q);
    if (!snap.empty) return { error: "Bu telefon raqam avval ro'yxatdan o'tgan" };
    const user = { id: Date.now(), name, phone, registeredAt: new Date().toISOString() };
    await setDoc(doc(db, COLLECTIONS.users, String(user.id)), user);
    const notif = { id: Date.now(), message: `Yangi foydalanuvchi ro'yxatdan o'tdi: ${name} (${phone})`, type: 'user_register', time: new Date().toISOString(), read: false, target: 'admin' };
    await setDoc(doc(db, COLLECTIONS.notifications, String(notif.id)), notif);
    return { user };
  } catch { return null; }
};

export const apiLogin = async (name, phone) => {
  try {
    const q = query(collection(db, COLLECTIONS.users), where('name', '==', name), where('phone', '==', phone));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const userDoc = snap.docs[0];
    return { user: { ...userDoc.data(), id: isNaN(Number(userDoc.id)) ? userDoc.id : Number(userDoc.id) } };
  } catch { return null; }
};
