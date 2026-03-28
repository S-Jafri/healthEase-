import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { HospitalAdmin } from '../../types';
import { CalendarX2, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function HospitalAppointments() {
    const { user } = useAuth();
    const admin = user as HospitalAdmin;

    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitalAppointments = async () => {
            if (!admin) return;
            try {
                const [aptRes, patRes, docRes] = await Promise.all([
                    apiClient.get('/appointments'),
                    apiClient.get('/patients'),
                    apiClient.get('/doctors')
                ]);

                setAppointments(aptRes.data.filter((a: any) => a.hospitalId === admin.hospitalId));
                setPatients(patRes.data);
                setDoctors(docRes.data.filter((d: any) => d.hospitalId === admin.hospitalId));
            } catch (error) {
                console.error("Failed to load hospital appointments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHospitalAppointments();
    }, [admin]);

    const [filter, setFilter] = useState<'all' | 'waiting'>('waiting');

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === filter);

    const handleCancel = async (id: string) => {
        if (window.confirm("Are you sure you want to forcibly cancel this appointment?")) {
            try {
                await apiClient.patch(`/appointments/${id}/status`, { status: 'cancelled' });
                setAppointments(prev => prev.map(apt =>
                    apt.id === id ? { ...apt, status: 'cancelled' } : apt
                ));
            } catch (error) {
                console.error("Failed to cancel appointment", error);
                alert("Failed to cancel the appointment on the server.");
            }
        }
    };

    if (loading) return <div className="p-8">Loading hospital appointments...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Hospital Appointment Control</h2>
                    <p className="text-muted-foreground">View active schedules and intervene if necessary.</p>
                </div>

                <div className="flex bg-muted p-1 rounded-md border border-border">
                    <button
                        onClick={() => setFilter('waiting')}
                        className={`px-4 py-1.5 text-sm font-medium rounded capitalize transition-all ${filter === 'waiting' ? 'bg-card shadow-sm text-teal-700' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Active Queue (Waiting)
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-sm font-medium rounded capitalize transition-all ${filter === 'all' ? 'bg-card shadow-sm text-teal-700' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        All Appointments
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                        <CalendarX2 className="h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-1">No Appointments Found</h3>
                        <p className="max-w-md">There are no appointments matching the current filter for your hospital.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-background border-b border-border text-sm font-semibold text-muted-foreground">
                                    <th className="p-4 w-16 text-center">Token</th>
                                    <th className="p-4">Patient Info</th>
                                    <th className="p-4">Assigned Doctor</th>
                                    <th className="p-4">Schedule</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Admin Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAppointments.map(apt => {
                                    const patient = patients.find(p => p.id === apt.patientId);
                                    const doctor = doctors.find(d => d.id === apt.doctorId);

                                    return (
                                        <tr key={apt.id} className="hover:bg-background/70 transition-colors">
                                            <td className="p-4 text-center">
                                                <span className="font-bold text-xl text-foreground">#{apt.tokenNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-foreground">{patient?.name}</div>
                                                <div className="text-sm text-muted-foreground mt-0.5">{patient?.contactNumber}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-foreground">{doctor?.name}</div>
                                                <div className="text-sm text-blue-600 font-medium mt-0.5">{doctor?.specialization}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-foreground font-medium">
                                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="truncate">{new Date(apt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span>Est. {apt.estimatedTime}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full capitalize ${apt.status === 'waiting' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                    apt.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                        'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {apt.status === 'waiting' && (
                                                    <button
                                                        onClick={() => handleCancel(apt.id)}
                                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-card border border-red-200 rounded text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                        Force Cancel
                                                    </button>
                                                )}
                                                {apt.status !== 'waiting' && (
                                                    <span className="text-sm text-muted-foreground italic">No Action</span>
                                                )}
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
