import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { LayoutDashboard, UserCircle, CalendarPlus, CalendarDays, Activity, Bell, LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from '../../components/theme/ThemeToggle';

import PatientProfile from './PatientProfile';
import PatientAppointments from './PatientAppointments';
import PatientBook from './PatientBook';
import PatientQueue from './PatientQueue';

export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Overview', path: '/patient', icon: LayoutDashboard },
        { name: 'My Profile', path: '/patient/profile', icon: UserCircle },
        { name: 'Book Appointment', path: '/patient/book', icon: CalendarPlus },
        { name: 'My Appointments', path: '/patient/appointments', icon: CalendarDays },
        { name: 'Live Queue', path: '/patient/queue', icon: Activity },
    ];

    const currentPath = location.pathname;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 border-b border-border px-4">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Activity className="h-6 w-6" /> HealthEase
                    </h1>
                </div>

                <div className="p-4 flex flex-col gap-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = currentPath === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-border">
                    <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-md">
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/patient/notifications" className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-medium text-foreground">{user?.name}</p>
                                <p className="text-muted-foreground capitalize">{user?.role.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Routes>
                        <Route path="/" element={<div className="text-2xl font-bold">Welcome back, {user?.name}!</div>} />
                        <Route path="/profile" element={<PatientProfile />} />
                        <Route path="/appointments" element={<PatientAppointments />} />
                        <Route path="/book" element={<PatientBook />} />
                        <Route path="/queue" element={<PatientQueue />} />
                    </Routes>
                </div>
            </main>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
