import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Building, ShieldAlert, LogOut, Menu, ActivitySquare } from 'lucide-react';
import { ThemeToggle } from '../../components/theme/ThemeToggle';

import PlatformMetrics from './PlatformMetrics';
import ManageUsers from './ManageUsers';
import ApproveHospitals from './ApproveHospitals';

export default function SuperAdminDashboard() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Platform Metrics', path: '/admin', icon: ActivitySquare },
        { name: 'Manage Users', path: '/admin/users', icon: Users },
        { name: 'Hospital Registrations', path: '/admin/hospitals', icon: Building },
    ];

    const currentPath = location.pathname;

    return (
        <div className="flex h-screen bg-muted overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 border-b border-slate-800 px-4 bg-slate-950">
                    <h1 className="text-xl font-black flex items-center gap-2 text-white uppercase tracking-widest">
                        <ShieldAlert className="h-6 w-6 text-red-500" /> SYS_ADMIN
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
                                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all ${isActive ? 'bg-red-600/10 text-red-500 font-bold border border-red-500/20' : 'text-muted-foreground hover:bg-slate-800 hover:text-white font-medium'}`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-950">
                    <button onClick={logout} className="flex items-center justify-center font-bold uppercase tracking-wider text-sm gap-3 px-3 py-3 rounded-md w-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg">
                        <LogOut className="h-4 w-4" />
                        System Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-md">
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="h-9 w-9 rounded-md bg-red-100 flex items-center justify-center text-red-700 font-black border-2 border-red-200">
                                A
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-bold text-foreground">System Administrator</p>
                                <p className="text-red-600 font-bold uppercase tracking-wider text-[10px]">Root Access</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8 bg-background">
                    <Routes>
                        <Route path="/" element={<PlatformMetrics />} />
                        <Route path="/users" element={<ManageUsers />} />
                        <Route path="/hospitals" element={<ApproveHospitals />} />
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
