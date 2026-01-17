import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Settings() {
  const { token, user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [customization, setCustomization] = useState({
    watermarkEnabled: true,
    watermarkText: 'Obfuscated with ShinraGuard',
    uiTheme: 'dark'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setCustomization(response.data.customization);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/users/profile`, 
        { customization },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Username</label>
            <p className="text-white font-semibold">{profile?.username}</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <p className="text-white font-semibold">{profile?.email}</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Plan</label>
            <p className="text-white font-semibold capitalize">{profile?.plan}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Customization</h2>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-3 mb-2">
              <input 
                type="checkbox"
                checked={customization.watermarkEnabled}
                onChange={(e) => setCustomization({...customization, watermarkEnabled: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-white">Enable Watermark</span>
            </label>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Watermark Text</label>
            <input 
              type="text"
              value={customization.watermarkText}
              onChange={(e) => setCustomization({...customization, watermarkText: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">UI Theme</label>
            <select 
              value={customization.uiTheme}
              onChange={(e) => setCustomization({...customization, uiTheme: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-2 rounded font-semibold transition"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
