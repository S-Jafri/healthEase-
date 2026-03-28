import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Building2, CalendarX2, Stethoscope, LogOut, Menu, Shield } from 'lucide-react';
import { ThemeToggle } from '../../components/theme/ThemeToggle';

import HospitalProfile from './HospitalProfile';
import HospitalDepartments from './HospitalDepartments';
import HospitalAppointments from './HospitalAppointments';

export default function HospitalDashboard() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Overview', path: '/hospital', icon: LayoutDashboard },
        { name: 'Hospital Profile', path: '/hospital/profile', icon: Building2 },
        { name: 'Departments & Doctors', path: '/hospital/departments', icon: Stethoscope },
        { name: 'Appointment Control', path: '/hospital/appointments', icon: CalendarX2 },
    ];

    const currentPath = location.pathname;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-teal-900 text-teal-100 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 border-b border-teal-800 px-4">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-white tracking-wide">
                        <Shield className="h-5 w-5 text-teal-400" /> Admin Console
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-teal-700 text-white font-semibold shadow-sm' : 'hover:bg-teal-800 hover:text-white'}`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-teal-800">
                    <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left hover:bg-red-500/10 text-red-300 transition-colors">
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
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="h-8 w-8 rounded bg-teal-100 flex items-center justify-center text-teal-800 font-bold border border-teal-200">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-semibold text-foreground">{user?.name}</p>
                                <p className="text-teal-700 font-medium capitalize text-xs">Hospital Administrator</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Routes>
                        <Route path="/" element={
                            <div className="space-y-6 max-w-5xl mx-auto">
                                <h2 className="text-2xl font-bold text-foreground">Hospital Administration Overview</h2>
                                <p className="text-muted-foreground">Use the sidebar to manage hospital details, doctors, and active appointments.</p>
                            </div>
                        } />
                        <Route path="/profile" element={<HospitalProfile />} />
                        <Route path="/departments" element={<HospitalDepartments />} />
                        <Route path="/appointments" element={<HospitalAppointments />} />
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
