// src/hooks/useNotificationSocket.ts
import {
  getNotifications,
  markAsRead,
  Notification,
} from '@/api/notification.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseNotificationSocketProps {
  token: string;
  userId: string;
  onNotification: (notif: Notification) => void;
}

export function useNotificationSocket({
  token,
  userId,
  onNotification,
}: UseNotificationSocketProps) {
  useEffect(() => {
    if (!token || !userId) return;

    const socket: Socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    // Adapte si besoin selon ton backend
    socket.emit('join-user', userId);

    socket.on('notification', (data: Notification) => {
      console.log(data);
      onNotification && onNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId, onNotification]);
}

export const useNotification = (token: string) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(token),
    refetchOnWindowFocus: false,
  });
};

export const useMarkAsRead = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-as-read'],
    mutationFn: ({ notificationId }: any) => markAsRead(token, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      console.log('Notification marquée comme lue');
    },
    onError: () => {
      console.log('Erreur lors du marquage comme lue');
    },
  });
};
