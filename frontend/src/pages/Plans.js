import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const DISCORD_LINK = 'https://discord.gg/hgn7Q8DUGu';

export default function Plans() {
  const { token, user } = useAuthStore();
  const [plans, setPlans] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
    if (token) fetchCurrentPlan();
  }, [token]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/plans/list`);
      setPlans(response.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const response = await axios.get(`${API_URL}/plans/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentPlan(response.data.currentPlan);
    } catch (err) {
      console.error('Error fetching current plan:', err);
    }
  };

  if (!plans) return <div className="p-8 text-center">Loading plans...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Upgrade Your Plan</h1>
      <p className="text-gray-400 text-center mb-12">Choose the perfect plan for your needs</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <div 
            key={key} 
            className={`p-6 rounded-lg border-2 transition ${
              currentPlan === key 
                ? 'bg-blue-900 border-blue-500' 
                : 'bg-gray-800 border-gray-700 hover:border-blue-500'
            }`}
          >
            <h3 className="text-2xl font-bold mb-2 capitalize">{plan.name}</h3>
            <p className="text-3xl font-bold text-green-500 mb-4">${plan.price}<span className="text-sm">/mo</span></p>
            
            <div className="space-y-3 mb-6">
              <div className="text-sm">
                <p className="text-gray-400">Obfuscations/Month</p>
                <p className="font-semibold text-blue-400">{plan.obfuscationPerMonth}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400">Script Limit</p>
                <p className="font-semibold text-purple-400">{plan.scriptLimit}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400">Storage</p>
                <p className="font-semibold text-orange-400">{(plan.storageLimit / 1073741824).toFixed(1)} GB</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => window.location.href = DISCORD_LINK}
              className={`w-full py-2 rounded font-semibold transition ${
                currentPlan === key
                  ? 'bg-blue-600 cursor-default opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={currentPlan === key}
            >
              {currentPlan === key ? 'Current Plan' : 'Get Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-2xl font-bold mb-4">How to Upgrade?</h3>
        <p className="text-gray-300 mb-4">
          To upgrade your plan, join our Discord server and follow the instructions. You'll need to provide your invite link.
        </p>
        <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition">
          Join Discord
        </a>
      </div>
    </div>
  );
}
