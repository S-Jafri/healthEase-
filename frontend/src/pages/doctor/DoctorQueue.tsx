import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Users, Clock, AlertTriangle, CheckCircle2, FastForward, User } from 'lucide-react';

export default function DoctorQueue() {
    const { user } = useAuth();

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
                setAppointments(aptRes.data);
                setPatients(patRes.data);
            } catch (error) {
                console.error("Failed to fetch queue data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Get today's waiting appointments for this doctor, sorted by token
    const todaysQueue = appointments
        .filter(apt => apt.doctorId === user?.id && apt.status === 'waiting')
        .sort((a, b) => a.tokenNumber - b.tokenNumber);

    const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
    const [delayMinutes, setDelayMinutes] = useState(0);

    const currentAppointment = todaysQueue[currentTokenIndex];
    const currentPatient = patients.find(p => p.id === currentAppointment?.patientId);

    const handleNext = async (status: string) => {
        if (!currentAppointment) return;
        try {
            await apiClient.patch(`/appointments/${currentAppointment.id}/status`, {
                status: status,
                delayMinutes: delayMinutes
            });
            // Advance locally for immediate UI response
            if (currentTokenIndex < todaysQueue.length - 1) {
                setCurrentTokenIndex(prev => prev + 1);
            } else {
                // If it was the last patient, trigger a refetch to show queue is empty
                const aptRes = await apiClient.get('/appointments');
                setAppointments(aptRes.data);
            }
        } catch (error) {
            console.error("Failed to update appointment status", error);
            alert("Failed to update queue status on server.");
        }
    };

    const handleApplyDelay = async (mins: number) => {
        setDelayMinutes(mins);
        if (currentAppointment) {
            try {
                // Broadcast delay without changing patient status
                await apiClient.patch(`/appointments/${currentAppointment.id}/status`, {
                    status: 'delayed',
                    delayMinutes: mins
                });
            } catch (error) {
                console.error("Failed to broadcast delay", error);
            }
        }
    };

    if (loading) return <div className="p-8">Loading live queue...</div>;

    if (!currentAppointment) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground">Live Queue Management</h2>
                <div className="bg-card p-12 text-center rounded-lg border border-border shadow-sm">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Queue Empty</h3>
                    <p className="text-muted-foreground">You have no waiting patients in your queue for today.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        Live Queue Management
                        <span className="relative flex h-3 w-3 ml-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-1">Control the flow of your active appointments.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleApplyDelay(15)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 font-medium text-sm transition-colors"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        +15m Delay
                    </button>
                    <button
                        onClick={() => handleApplyDelay(30)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 font-medium text-sm transition-colors"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        +30m Delay
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Patient Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-lg border-2 border-primary/20 shadow-md overflow-hidden relative">
                        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1.5 rounded-bl-lg font-bold">
                            CURRENT TOKEN: #{currentAppointment.tokenNumber}
                        </div>

                        <div className="p-8">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                    <User className="h-10 w-10" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-foreground mb-1">{currentPatient?.name}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground font-medium">
                                        <span className="bg-muted px-3 py-1 rounded-full">{currentPatient?.age} Years</span>
                                        <span className="bg-muted px-3 py-1 rounded-full">Blood: {currentPatient?.bloodGroup || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background border border-border rounded-lg p-5 mb-8">
                                <p className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Patient Medical Summary</p>
                                <p className="text-muted-foreground">{currentPatient?.medicalHistorySummary || 'No summary provided.'}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                                <button
                                    onClick={() => handleNext('completed')}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold transition-colors shadow-sm"
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                    Mark Completed & Call Next
                                </button>
                                <button
                                    onClick={() => handleNext('skipped')}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-card text-foreground border border-slate-300 rounded-lg hover:bg-background font-semibold transition-colors"
                                >
                                    <FastForward className="h-5 w-5" />
                                    Skip Patient
                                </button>
                            </div>
                        </div>
                    </div>

                    {delayMinutes > 0 && (
                        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded-md flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p className="font-medium">Active Delay Broadcasted: <span className="font-bold">{delayMinutes} minutes</span> behind schedule.</p>
                            <button
                                onClick={() => setDelayMinutes(0)}
                                className="ml-auto text-sm font-bold underline hover:text-amber-900"
                            >
                                Clear Delay
                            </button>
                        </div>
                    )}
                </div>

                {/* Real-time Up Next Sidebar */}
                <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col h-full">
                    <div className="p-4 border-b border-border bg-background flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-bold text-foreground">Up Next</h3>
                        <span className="ml-auto bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {todaysQueue.length - currentTokenIndex - 1} Waiting
                        </span>
                    </div>

                    <div className="flex-1 overflow-auto p-2">
                        {todaysQueue.slice(currentTokenIndex + 1).map((apt) => {
                            const p = patients.find(pat => pat.id === apt.patientId);
                            return (
                                <div key={apt.id} className="p-3 mb-2 rounded-md border border-border hover:bg-background transition-colors flex gap-3">
                                    <div className="h-10 w-10 shrink-0 bg-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                                        #{apt.tokenNumber}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-foreground truncate">{p?.name}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">Est: {apt.estimatedTime}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {todaysQueue.length - currentTokenIndex - 1 === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No more patients in the queue.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
