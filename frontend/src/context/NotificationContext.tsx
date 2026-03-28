import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Derived state
    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await apiClient.get(`/notifications?user_id=${user.id}`);
            // Sort by createdAt descending
            const sorted = res.data.sort((a: Notification, b: Notification) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setNotifications(sorted);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        try {
            await apiClient.patch('/notifications/read-all', { userId: user.id });
            // Optimistically update local state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    // Initial fetch when user logs in
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Polling every 30 seconds for new notifications to keep the bubble alive
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
