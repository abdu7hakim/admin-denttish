import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check credentials
      if (username === 'admin' && password === 'admin3379') {
        // Correct credentials
        setTimeout(() => {
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          localStorage.setItem('adminUsername', username);
          navigate('/admin/dashboard');
        }, 1000);
      } else if (!username || !password) {
        setError('Username va parolni to\'ldiring');
        setLoading(false);
      } else {
        setError('Username yoki parol noto\'g\'ri');
        setLoading(false);
      }
    } catch (err) {
      setError('Kirish amalga oshmadi. Iltimos qayta urinib ko\'ring.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-50 h-28 mx-auto rounded-2xl "
              />
            </div>
            <h1 className="text-4xl font-bold text-blue-800 mb-3">
              Zamonaviy<br />
              boshqaruv
            </h1>
            <p className="text-blue-600 text-lg leading-relaxed">
              Platforma orqali bemorlar hisobi,<br />
              uchrashuvlar jadvali va klinika moliyasini<br />
              qulay tizimda boshqaring.
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Xush kelibsiz!
            </h2>
            <p className="text-gray-600">
              Tizimga kirish uchun hisob ma'lumotlarini kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Meni eslab qol</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Parolni unutdingizmi?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Kirish...
                </>
              ) : (
                'Tizimga kirish'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
