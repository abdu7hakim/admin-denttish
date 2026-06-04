import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component
 * Tekshiradi admin token borligini, agar bo'lmasa login sahifasiga yo'naltiradi
 * 
 * Foydalanish:
 * <ProtectedRoute>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

/**
 * Logout funksiyasi
 * Admin token va email ma'lumotlarini tozalaydi
 */
export function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
  window.location.href = '/admin/login';
}

/**
 * Admin token olish
 */
export function getAdminToken() {
  return localStorage.getItem('adminToken');
}

/**
 * Admin email olish
 */
export function getAdminEmail() {
  return localStorage.getItem('adminEmail');
}

/**
 * Kiriş funktsiyasi (Future: Backend bilan integratsiya)
 * @param {string} email - Admin email
 * @param {string} password - Admin parol
 * @returns {Promise} Login natijalari
 */
export async function loginAdmin(email, password) {
  try {
    // Backend API endpoint (Hali yo'q, faqat placeholder)
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Kiriş amalga oshmadi');
    }

    const data = await response.json();
    
    // Token va email saqlash
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminEmail', email);
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * API request bilan admin token yuborish
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
export async function authenticatedFetch(url, options = {}) {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('Admin token topilmadi');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}
