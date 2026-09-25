import api from './api';

// Get current user's notifications and unread count
export const getMyNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

// Mark single notification as read
export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

// Seed demo notifications
export const seedDemoNotifications = async () => {
  const response = await api.post('/notifications/seed');
  return response.data;
};
