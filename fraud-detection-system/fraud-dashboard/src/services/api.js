import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';

export const api = {
  getAlerts: () => axios.get(`${API_BASE}/alerts`),
  getAlertById: (id) => axios.get(`${API_BASE}/alerts/${id}`),
  getAlertsByRisk: (level) => axios.get(`${API_BASE}/alerts/risk/${level}`),
  getAlertsByStatus: (status) => axios.get(`${API_BASE}/alerts/status/${status}`),
  updateAlertStatus: (id, status) => axios.put(`${API_BASE}/alerts/${id}/status`, { status }),
  getStats: () => axios.get(`${API_BASE}/alerts/stats`),
};
