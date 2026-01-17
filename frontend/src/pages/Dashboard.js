import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/plans/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.username}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Current Plan</h3>
          <p className="text-3xl font-bold text-blue-500 capitalize">{stats?.currentPlan}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Obfuscations</h3>
          <p className="text-3xl font-bold text-green-500">{stats?.usage?.obfuscation} / {stats?.usage?.quota}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Scripts</h3>
          <p className="text-3xl font-bold text-purple-500">{stats?.usage?.scripts} / {stats?.usage?.scriptLimit}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Storage</h3>
          <p className="text-3xl font-bold text-orange-500">{(stats?.usage?.storage / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/obfuscate" className="block bg-blue-600 hover:bg-blue-700 p-3 rounded text-center font-semibold transition">
              Obfuscate Script
            </a>
            <a href="/scripts" className="block bg-purple-600 hover:bg-purple-700 p-3 rounded text-center font-semibold transition">
              My Scripts
            </a>
            <a href="/plans" className="block bg-green-600 hover:bg-green-700 p-3 rounded text-center font-semibold transition">
              Upgrade Plan
            </a>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Plan Features</h2>
          <ul className="space-y-2 text-gray-300">
            {stats?.planDetails?.features?.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
