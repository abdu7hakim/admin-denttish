const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'adminToken';

function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken() { return getToken(); }

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const token = getToken();
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const apiRegister = (name, phone) => req('POST', '/auth/register', { name, phone });
export const apiLogin = (name, phone) => req('POST', '/auth/login', { name, phone });
export const apiAdminLogin = (username, password) => req('POST', '/auth/admin-login', { username, password });

export const apiGetDoctors = () => req('GET', '/doctors');
export const apiAddDoctor = (data) => req('POST', '/doctors', data);
export const apiUpdateDoctor = (id, data) => req('PUT', `/doctors/${id}`, data);
export const apiDeleteDoctor = (id) => req('DELETE', `/doctors/${id}`);

export const apiGetAppointments = (phone) => req('GET', `/appointments${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`);
export const apiAddAppointment = (data) => req('POST', '/appointments', data);
export const apiUpdateAppointment = (id, data) => req('PUT', `/appointments/${id}`, data);
export const apiDeleteAppointment = (id) => req('DELETE', `/appointments/${id}`);

export const apiGetUsers = () => req('GET', '/users');

export const apiGetNotifications = (target) => req('GET', `/notifications?target=${encodeURIComponent(target)}`);
export const apiMarkRead = (id) => req('POST', '/notifications/mark-read', { id });
export const apiMarkAllRead = () => req('POST', '/notifications/mark-all-read');

export const apiGetSettings = () => req('GET', '/settings');
export const apiUpdateSettings = (data) => req('PUT', '/settings', data);

export const apiGetCategories = () => req('GET', '/categories');
export const apiAddCategory = (name) => req('POST', '/categories', { name });
export const apiDeleteCategory = (name) => req('DELETE', `/categories/${encodeURIComponent(name)}`);

export const apiGetStatistics = () => req('GET', '/statistics');

export const apiGetClinics = () => req('GET', '/clinics');
export const apiAddClinic = (data) => req('POST', '/clinics', data);
export const apiUpdateClinic = (id, data) => req('PUT', `/clinics/${id}`, data);
export const apiDeleteClinic = (id) => req('DELETE', `/clinics/${id}`);

