import api from './api';

export const getComments = async (problemId) => {
  const res = await api.get(`/problems/${problemId}/comments`);
  return res.data;
};

export const createComment = async (problemId, commentData) => {
  const res = await api.post(`/problems/${problemId}/comments`, commentData);
  return res.data;
};
