import api from './api';

export const createCollaboration = async (collabData) => {
  const res = await api.post('/collaborations', collabData);
  return res.data;
};

export const getMyCollaborations = async () => {
  const res = await api.get('/collaborations/my');
  return res.data;
};

export const getIndustryStats = async () => {
  const res = await api.get('/collaborations/industry-stats');
  return res.data;
};
