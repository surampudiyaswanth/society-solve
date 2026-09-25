import api from './api';

export const createSolution = async (solutionData) => {
  const res = await api.post('/solutions', solutionData);
  return res.data;
};

export const getSolutions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/solutions${query ? `?${query}` : ''}`);
  return res.data;
};

export const claimProblem = async (problemId, claimData) => {
  const res = await api.post(`/solutions/claim/${problemId}`, claimData);
  return res.data;
};

export const getUniversityStats = async () => {
  const res = await api.get('/solutions/university-stats');
  return res.data;
};
