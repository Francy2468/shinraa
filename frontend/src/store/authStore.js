import React, { createContext, useContext } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      set({ 
        user: response.data.user, 
        token: response.data.token,
        loading: false 
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login failed', loading: false });
      throw err;
    }
  },
  
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      set({ 
        user: response.data.user, 
        token: response.data.token,
        loading: false 
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Registration failed', loading: false });
      throw err;
    }
  },
  
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },
  
  getMe: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data });
    } catch (err) {
      set({ user: null, token: null });
      localStorage.removeItem('token');
    }
  }
}));

export default useAuthStore;
