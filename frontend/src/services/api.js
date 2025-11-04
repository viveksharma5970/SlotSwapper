import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_DEPLOYED_URL = 'https://slot-swapper-backend-omega.vercel.app/api';

const api = axios.create({
  baseURL: API_DEPLOYED_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  signup: (name, email, password) => 
    api.post('/auth/signup', { name, email, password }),
};

export const eventsAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (event) => api.post('/events', event),
  updateEvent: (id, event) => api.put(`/events/${id}`, event),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const swapsAPI = {
  getSwappableSlots: () => api.get('/swaps/swappable-slots'),
  createSwapRequest: (mySlotId, theirSlotId) => 
    api.post('/swaps/swap-request', { mySlotId, theirSlotId }),
  respondToSwap: (requestId, accepted) => 
    api.post(`/swaps/swap-response/${requestId}`, { accepted }),
  getSwapRequests: () => api.get('/swaps/requests'),
};

export default api;