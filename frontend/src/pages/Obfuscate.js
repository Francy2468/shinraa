import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Obfuscate() {
  const { token } = useAuthStore();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [obfuscationLevel, setObfuscationLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleObfuscate = async (e) => {
    e.preventDefault();
    if (!code || !name) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/obfuscate/obfuscate`, 
        { code, name, obfuscationLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.script);
    } catch (err) {
      alert(err.response?.data?.error || 'Obfuscation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.loaderCode));
    element.setAttribute('download', `${result.name}.lua`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Script Obfuscator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Obfuscate Your Script</h2>
          
          <form onSubmit={handleObfuscate} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Script Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Amazing Script"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Obfuscation Level</label>
              <select 
                value={obfuscationLevel}
                onChange={(e) => setObfuscationLevel(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value={1}>Level 1 - Basic</option>
                <option value={2}>Level 2 - Standard</option>
                <option value={3}>Level 3 - Advanced</option>
                <option value={4}>Level 4 - Maximum</option>
                <option value={5}>Level 5 - Elite</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Lua Code</label>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your Lua script here..."
                className="w-full h-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-2 rounded font-semibold transition"
            >
              {loading ? 'Obfuscating...' : 'Obfuscate Now'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Obfuscated Code</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(result.loaderCode)}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-semibold transition"
                >
                  Copy Loader
                </button>
                <button 
                  onClick={downloadScript}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold transition"
                >
                  Download
                </button>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-600 max-h-96 overflow-auto">
                <p className="text-gray-400 text-sm mb-2">Loader Code:</p>
                <code className="text-green-400 text-xs whitespace-pre-wrap font-mono">
                  {result.loaderCode.substring(0, 500)}...
                </code>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-900 p-3 rounded border border-gray-600">
                  <p className="text-gray-400">Obfuscation Level</p>
                  <p className="text-xl font-bold text-blue-500">{result.obfuscationLevel}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded border border-gray-600">
                  <p className="text-gray-400">Status</p>
                  <p className="text-xl font-bold text-green-500 capitalize">{result.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
