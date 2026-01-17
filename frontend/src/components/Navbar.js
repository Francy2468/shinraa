import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-500">
          ShinraGuard
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/obfuscate" className="hover:text-blue-400 transition">Obfuscate</Link>
          <Link to="/scripts" className="hover:text-blue-400 transition">My Scripts</Link>
          <Link to="/plans" className="hover:text-blue-400 transition">Plans</Link>
          <Link to="/settings" className="hover:text-blue-400 transition">Settings</Link>
          
          <div className="flex items-center gap-3">
            <span className="text-gray-300">{user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
