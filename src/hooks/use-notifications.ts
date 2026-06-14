'use client';

import { useState, useCallback } from 'react';

export type NotificationTab = 'all' | 'deadlines' | 'approvals';

export interface Notification {
  id: string;
  title: string;
  desc: string;
  timeAgo: string;
  type: 'deadline' | 'approval' | 'info';
  read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  activeTab: NotificationTab;
  setActiveTab: (tab: NotificationTab) => void;
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  filteredNotifications: Notification[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Episodio 35 pendiente',
    desc: 'Vence en 3 días — sin guión final',
    timeAgo: 'Hace 2 horas',
    type: 'deadline',
    read: false,
  },
  {
    id: '2',
    title: 'Copy aprobado',
    desc: 'Caption EP34 listo para publicar',
    timeAgo: 'Hace 5 horas',
    type: 'approval',
    read: false,
  },
  {
    id: '3',
    title: 'Deadline semana',
    desc: 'Edición EP33 vence mañana',
    timeAgo: 'Hace 1 día',
    type: 'deadline',
    read: true,
  },
  {
    id: '4',
    title: 'Revisión pendiente',
    desc: 'Carrusel EP34 esperando aprobación',
    timeAgo: 'Hace 2 días',
    type: 'approval',
    read: false,
  },
];

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deadlines') return n.type === 'deadline';
    if (activeTab === 'approvals') return n.type === 'approval';
    return true;
  });

  return {
    notifications,
    activeTab,
    setActiveTab,
    unreadCount,
    markAllRead,
    markRead,
    filteredNotifications,
  };
}
