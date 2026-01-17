import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Obfuscate from './pages/Obfuscate';
import Scripts from './pages/Scripts';
import Plans from './pages/Plans';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

function App() {
  const { token, getMe } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/obfuscate" element={token ? <Obfuscate /> : <Navigate to="/login" />} />
        <Route path="/scripts" element={token ? <Scripts /> : <Navigate to="/login" />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
