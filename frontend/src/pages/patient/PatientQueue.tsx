import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Activity, Users, Clock, AlertTriangle } from 'lucide-react';

export default function PatientQueue() {
    const { user } = useAuth();
    const [activeAppointment, setActiveAppointment] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueue = async () => {
            if (!user) return;
            try {
                const [aptRes, docRes] = await Promise.all([
                    apiClient.get('/appointments'),
                    apiClient.get('/doctors')
                ]);

                const active = aptRes.data.find(
                    (apt: any) => apt.patientId === user.id && apt.status === 'waiting'
                );

                if (active) {
                    setActiveAppointment(active);
                    const doc = docRes.data.find((d: any) => d.id === active.doctorId);
                    setDoctor(doc);
                }
            } catch (error) {
                console.error("Failed to fetch queue", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQueue();
    }, [user]);

    // Live data state from WebSockets
    const [currentRunningToken, setCurrentRunningToken] = useState(1);
    const [estimatedDelay, setEstimatedDelay] = useState(0);

    // Connect to WebSocket for real-time queue movement
    useEffect(() => {
        if (!activeAppointment) return;

        // Using standard WebSocket API
        const wsUrl = `ws://localhost:8000/ws/queue/${activeAppointment.doctorId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to Doctor's Live Queue");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'QUEUE_UPDATE') {
                    console.log("Queue updated:", data);
                    setCurrentRunningToken(data.currentToken);
                    if (data.delayMinutes !== undefined) {
                        setEstimatedDelay(data.delayMinutes);
                    }
                }
            } catch (err) {
                console.error("Failed to parse websocket message", err);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from Live Queue");
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, [activeAppointment]);

    if (loading) return <div className="p-8">Loading queue data...</div>;

    if (!activeAppointment) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Live Queue Tracking</h2>
                </div>
                <div className="bg-card rounded-lg border border-border p-12 text-center">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Active Queue</h3>
                    <p className="text-muted-foreground">You don't have any appointments scheduled for today tracking in the live queue.</p>
                </div>
            </div>
        );
    }

    const patientsAhead = Math.max(0, activeAppointment.tokenNumber - currentRunningToken);
    const totalTokens = activeAppointment.tokenNumber;
    const progressPercent = Math.min(100, (currentRunningToken / totalTokens) * 100);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Live Queue Tracking</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live Sync Active • Updating every 30s
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Status Card */}
                <div className="md:col-span-2 bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-background flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Consultation with</p>
                            <h3 className="text-xl font-bold text-foreground">{doctor?.name}</h3>
                            <p className="text-primary text-sm font-medium">{doctor?.specialization}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Your Token</p>
                            <p className="text-4xl font-black text-primary">#{activeAppointment.tokenNumber}</p>
                        </div>
                    </div>

                    <div className="p-8 pb-12">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Current Running Token</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-5xl font-black text-foreground">#{currentRunningToken}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-muted rounded-full h-4 relative overflow-hidden mt-6">
                            <div
                                className="bg-primary h-4 rounded-full transition-all duration-1000 ease-in-out relative"
                                style={{ width: `${progressPercent}%` }}
                            >
                                {/* Stripe effect for running progress */}
                                <div className="absolute inset-0 bg-card/20 animate-[moveBg_1s_linear_infinite]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-3 text-sm font-medium text-muted-foreground">
                            <span>Token #1</span>
                            <span>Your Token #{activeAppointment.tokenNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card rounded-lg border border-border shadow-sm p-6 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Patients Ahead</p>
                            <p className="text-3xl font-bold text-foreground">{patientsAhead}</p>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg border border-border shadow-sm p-6 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Est. Waiting Time</p>
                            <p className="text-2xl font-bold text-foreground">~{patientsAhead * 15} mins</p>
                            <p className="text-xs text-muted-foreground mt-1">Based on avg. 15 min consult</p>
                        </div>
                    </div>

                    {estimatedDelay > 0 && (
                        <div className="bg-amber-50 rounded-lg border border-amber-200 shadow-sm p-5 flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800">Doctor Delay Notice</p>
                                <p className="text-xs text-amber-700 mt-1">
                                    The doctor is running approximately {estimatedDelay} mins behind schedule. Your estimated waiting time has been adjusted.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
