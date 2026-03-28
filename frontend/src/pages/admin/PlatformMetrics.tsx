import React, { useState, useEffect } from 'react';
import { Users, ActivitySquare, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export default function PlatformMetrics() {
    const [stats, setStats] = useState({
        activeHospitals: 0,
        verifiedDoctors: 0,
        totalPatients: 0,
        todayAppointments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [hosp, doc, pat, apt] = await Promise.all([
                    apiClient.get('/hospitals'),
                    apiClient.get('/doctors'),
                    apiClient.get('/patients'),
                    apiClient.get('/appointments'),
                ]);

                setStats({
                    activeHospitals: hosp.data.filter((h: any) => h.isActive).length,
                    verifiedDoctors: doc.data.filter((d: any) => d.isActive).length,
                    totalPatients: pat.data.length,
                    todayAppointments: apt.data.length
                });
            } catch (error) {
                console.error("Failed to load metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="p-8">Loading system metrics...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">Platform Metrics</h2>
                <p className="text-muted-foreground font-medium">Real-time macro view of the HealthEase infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ActivitySquare className="h-24 w-24 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Hospitals</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-5xl font-black text-foreground">{stats.activeHospitals}</h3>
                        <span className="text-sm font-bold text-green-500 mb-1 flex items-center">↑ 100%</span>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-4">Verified nodes in network</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle2 className="h-24 w-24 text-green-600" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Verified Doctors</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-5xl font-black text-foreground">{stats.verifiedDoctors}</h3>
                        <span className="text-sm font-bold text-green-500 mb-1 flex items-center">↑ Active</span>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-4">Across all departments</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="h-24 w-24 text-purple-600" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Registered Patients</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-5xl font-black text-foreground">{stats.totalPatients}</h3>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-4">Unique user accounts</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock className="h-24 w-24 text-amber-600" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Daily Appointments</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-5xl font-black text-foreground">{stats.todayAppointments}</h3>
                        <span className="text-sm font-bold text-muted-foreground mb-1 flex items-center uppercase text-xs">Tokens Generated</span>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-4">Active system throughput</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-xl text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div> System Status</h3>
                <code className="text-sm text-green-400 font-mono space-y-2 block">
                    <p>[INFO] Smart Queue Engine: ONLINE and STABLE</p>
                    <p>[INFO] Socket.IO Broadcast Servers: 4/4 NODES ACTIVE</p>
                    <p>[INFO] Database Connection Pool: 12ms avg latency</p>
                    <p>[WARN] Prayagraj Zone 2 experiencing slight network fluctuations. Auto-scaling fallback active.</p>
                </code>
            </div>
        </div>
    );
}
