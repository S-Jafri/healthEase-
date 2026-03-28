import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

export default function PatientAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [aptRes, docRes, hospRes] = await Promise.all([
                    apiClient.get('/appointments'),
                    apiClient.get('/doctors'),
                    apiClient.get('/hospitals')
                ]);

                // Filter appointments for this patient
                const myApts = aptRes.data.filter((a: any) => a.patientId === user.id);
                setAppointments(myApts);
                setDoctors(docRes.data);
                setHospitals(hospRes.data);
            } catch (error) {
                console.error("Failed to fetch appointment data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <div className="p-8">Loading appointments...</div>;

    const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'waiting');
    const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

    const handleCancel = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await apiClient.patch(`/appointments/${id}/status`, { status: 'cancelled' });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        } catch (error) {
            console.error("Failed to cancel appointment", error);
            alert("Failed to cancel the appointment. Please try again.");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
                <p className="text-muted-foreground">View your upcoming and past appointments.</p>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                {upcomingAppointments.length === 0 && pastAppointments.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No appointments found.
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-200">
                        {[...upcomingAppointments, ...pastAppointments].map((apt) => {
                            const doctor = doctors.find(d => d.id === apt.doctorId);
                            const hospital = hospitals.find(h => h.id === apt.hospitalId);

                            return (
                                <li key={apt.id} className="p-6 hover:bg-background transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">{doctor?.name}</h3>
                                            <p className="text-primary font-medium text-sm mb-3">{doctor?.specialization}</p>

                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Token #{apt.tokenNumber} (Est. {apt.estimatedTime || 'Pending'})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{hospital?.name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${apt.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                                                apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {apt.status.toUpperCase()}
                                            </span>
                                            {apt.status === 'waiting' && (
                                                <button
                                                    onClick={() => handleCancel(apt.id)}
                                                    className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium underline transition-colors"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
