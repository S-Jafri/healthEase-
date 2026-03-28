import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Info, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PatientNotifications() {
    const { notifications, markAllAsRead, unreadCount } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-success" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
            case 'error': return <ShieldAlert className="h-5 w-5 text-destructive" />;
            default: return <Info className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-card p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Bell className="h-6 w-6 text-primary" /> Notifications
                    </h2>
                    <p className="text-muted-foreground mt-1">View your alerts for appointments, queue updates, and reports.</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-lg text-sm transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            
            {notifications.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">You have no new notifications.</p>
                    <p className="text-sm text-muted-foreground mt-1">We'll alert you when there are updates to your appointments or queue tokens.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div key={n.id} className={`bg-card rounded-lg border shadow-sm p-4 flex gap-4 ${!n.read ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                            <div className="mt-1 shrink-0">
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-foreground">{n.title}</h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                            </div>
                            {!n.read && (
                                <div className="shrink-0 flex items-center">
                                    <span className="h-2.5 w-2.5 bg-primary rounded-full"></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

