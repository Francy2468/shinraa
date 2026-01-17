import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Scripts() {
  const { token } = useAuthStore();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScripts();
  }, [token]);

  const fetchScripts = async () => {
    try {
      const response = await axios.get(`${API_URL}/scripts/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScripts(response.data);
    } catch (err) {
      console.error('Error fetching scripts:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteScript = async (id) => {
    if (!window.confirm('Are you sure you want to delete this script?')) return;
    
    try {
      await axios.delete(`${API_URL}/scripts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScripts(scripts.filter(s => s._id !== id));
    } catch (err) {
      alert('Error deleting script');
    }
  };

  const downloadScript = async (id, name) => {
    try {
      const response = await axios.post(`${API_URL}/scripts/${id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data));
      element.setAttribute('download', `${name}.lua`);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      alert('Error downloading script');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Scripts</h1>

      {scripts.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 mb-4">No scripts yet. Create one now!</p>
          <a href="/obfuscate" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition">
            Obfuscate Script
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {scripts.map(script => (
            <div key={script._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{script.name}</h3>
                  <p className="text-gray-400 text-sm">Level {script.obfuscationLevel}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  script.status === 'protected' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {script.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-gray-400">Size</p>
                  <p className="font-semibold">{(script.fileSize / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-gray-400">Downloads</p>
                  <p className="font-semibold">{script.downloadCount}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-gray-400">Executions</p>
                  <p className="font-semibold">{script.executionCount}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => downloadScript(script._id, script.name)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
                >
                  Download
                </button>
                <button 
                  onClick={() => deleteScript(script._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
