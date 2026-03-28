import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, FileText } from 'lucide-react';

export default function DoctorAppointments() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'waiting' | 'completed' | 'cancelled'>('all');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [aptRes, patRes] = await Promise.all([
                    apiClient.get('/appointments'),
                    apiClient.get('/patients')
                ]);

                const myApts = aptRes.data.filter((a: any) => a.doctorId === user.id);
                setAppointments(myApts);
                setPatients(patRes.data);
            } catch (error) {
                console.error("Failed to fetch appointment data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === filter);

    if (loading) return <div className="p-8">Loading appointments...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">All Appointments</h2>
                    <p className="text-muted-foreground">View and filter your complete appointment history.</p>
                </div>

                <div className="flex bg-muted p-1 rounded-md border border-border">
                    {(['all', 'waiting', 'completed', 'cancelled'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-sm font-medium rounded capitalize transition-all ${filter === f ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <Calendar className="h-10 w-10 text-slate-300 mb-3" />
                        <p>No appointments found matching this filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background border-b border-border text-sm font-semibold text-muted-foreground">
                                    <th className="p-4">Patient</th>
                                    <th className="p-4 hidden sm:table-cell">Date & Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAppointments.map(apt => {
                                    const patient = patients.find(p => p.id === apt.patientId);

                                    return (
                                        <tr key={apt.id} className="hover:bg-background/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-foreground">{patient?.name}</div>
                                                <div className="text-sm text-muted-foreground mt-0.5">Token #{apt.tokenNumber}</div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>Est. {apt.estimatedTime}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${apt.status === 'waiting' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    apt.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                        'bg-red-50 text-red-700 border border-red-200'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-card border border-slate-300 rounded text-sm font-medium hover:bg-background text-foreground transition-colors">
                                                    <FileText className="h-4 w-4" />
                                                    <span className="hidden lg:inline">View Chart</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
