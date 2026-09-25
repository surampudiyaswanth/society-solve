import api from './api';

export const getAdminStatistics = async () => {
  const res = await api.get('/admin/statistics');
  return res.data;
};

export const getAdminUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/users${query ? `?${query}` : ''}`);
  return res.data;
};

export const verifyUser = async (id) => {
  const res = await api.put(`/admin/users/${id}/verify`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const getAdminProblems = async () => {
  const res = await api.get('/admin/problems');
  return res.data;
};

export const moderateProblem = async (id, data) => {
  const res = await api.put(`/admin/problems/${id}/moderate`, data);
  return res.data;
};
