// src/api/notifications.ts
import axios from 'axios';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
}

const API_URL = 'http://localhost:5000/v1/api/notifications';

export const getNotifications = async (
  token: string,
  page = 1,
  limit = 20
): Promise<NotificationListResponse> => {
  const res = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const markAsRead = async (
  token: string,
  notificationId: string
): Promise<void> => {
  await axios.put(
    `${API_URL}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updatePreferences = async (
  token: string,
  prefs: any
): Promise<void> => {
  await axios.put(`${API_URL}/preferences`, prefs, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
