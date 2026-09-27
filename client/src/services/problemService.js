import api from './api';

export const createProblem = async (formData) => {
  // If formData is an instance of FormData, send with multipart/form-data
  const headers =
    formData instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

  const res = await api.post('/problems', formData, { headers });
  return res.data;
};

export const getProblems = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'All') {
      params.append(key, value);
    }
  });

  const res = await api.get(`/problems?${params.toString()}`);
  return res.data;
};

export const getMyProblems = async () => {
  const res = await api.get('/problems/my');
  return res.data;
};

export const getProblemById = async (id) => {
  const res = await api.get(`/problems/${id}`);
  return res.data;
};

export const updateProblemStatus = async (id, statusData) => {
  const res = await api.put(`/problems/${id}/status`, statusData);
  return res.data;
};

export const updateProblemStage = updateProblemStatus;
