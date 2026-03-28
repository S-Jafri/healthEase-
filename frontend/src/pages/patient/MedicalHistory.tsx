import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar as CalendarIcon, Clock, Stethoscope, Building2 } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function MedicalHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            if (!user) return;
            try {
                // Fetch appointments, doctors, and hospitals to enrich the history log
                const [aptsRes, docsRes, hospsRes] = await Promise.all([
                    apiClient.get('/appointments'),
                    apiClient.get('/doctors'),
                    apiClient.get('/hospitals')
                ]);
                
                const doctors = docsRes.data;
                const hospitals = hospsRes.data;

                // Filter for THIS patient and only COMPLETED appointments
                const myHistory = aptsRes.data.filter((a: any) => 
                    a.patientId === user.id && a.status === 'completed'
                );

                // Enrich the raw appointment data with friendly context
                const enrichedHistory = myHistory.map((apt: any) => {
                    const doc = doctors.find((d: any) => d.id === apt.doctorId);
                    const hosp = hospitals.find((h: any) => h.id === apt.hospitalId);
                    return {
                        ...apt,
                        doctorName: doc?.name || 'Unknown Doctor',
                        specialty: doc?.specialization || 'General',
                        hospitalName: hosp?.name || 'Unknown Facility',
                    };
                });

                // Sort descending by date
                enrichedHistory.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setHistory(enrichedHistory);
            } catch (error) {
                console.error("Failed to fetch medical history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Medical History</h2>
                <p className="text-muted-foreground">View your past continuous consultation records and discharge notes.</p>
            </div>
            
            {history.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center flex flex-col items-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No history available</h3>
                    <p className="text-muted-foreground">You do not possess any completed consultations on record yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((record) => (
                        <Card key={record.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        Consultation: {record.specialty}
                                        <Badge variant="outline" className="text-success border-success/30 bg-success/10 font-normal">
                                            Completed
                                        </Badge>
                                    </CardTitle>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                                            <CalendarIcon className="h-4 w-4" />
                                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                                            <Clock className="h-4 w-4" />
                                            {record.estimatedTime}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 bg-background p-1.5 rounded-full border border-border">
                                            <Stethoscope className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attending Physician</p>
                                            <p className="text-sm font-medium text-foreground">{record.doctorName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 bg-background p-1.5 rounded-full border border-border">
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Facility</p>
                                            <p className="text-sm font-medium text-foreground">{record.hospitalName}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
