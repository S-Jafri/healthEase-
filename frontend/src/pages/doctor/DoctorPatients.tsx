import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Activity, Calendar } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DoctorPatients() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorPatients = async () => {
            if (!user) return;
            try {
                // Fetch all appointments for this doctor to find their unique patients
                const aptsRes = await apiClient.get('/appointments');
                const doctorApts = aptsRes.data.filter((a: any) => a.doctorId === user.id);
                
                // Extract unique patient IDs
                const patientIds = [...new Set(doctorApts.map((a: any) => a.patientId))];

                if (patientIds.length === 0) {
                    setPatients([]);
                    setLoading(false);
                    return;
                }

                // Fetch full platform patient list and filter natively
                const patientsRes = await apiClient.get('/patients');
                const uniquePatients = patientsRes.data.filter((p: any) => patientIds.includes(p.id));

                // Map the latest appointment date for context
                const enrichedPatients = uniquePatients.map((p: any) => {
                    // Find their appointments with THIS doctor
                    const specificApts = doctorApts.filter((a: any) => a.patientId === p.id);
                    // Sort by date descending (latest first)
                    specificApts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    
                    return {
                        ...p,
                        lastVisit: specificApts[0]?.date || 'Unknown'
                    };
                });

                setPatients(enrichedPatients);
            } catch (error) {
                console.error("Failed to fetch doctor's patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorPatients();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">My Patients Directory</h2>
                <p className="text-muted-foreground">Access your patient list and historical medical profiles.</p>
            </div>
            
            {patients.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No patients yet</h3>
                    <p className="text-muted-foreground">You have not been assigned any appointments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <Card key={patient.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="font-semibold text-primary">
                                                {patient.name.split(' ').map((n: string) => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{patient.name}</CardTitle>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs font-normal">Age: {patient.age}</Badge>
                                                <Badge variant="outline" className="text-xs font-normal bg-destructive/5 text-destructive border-destructive/20">{patient.bloodGroup}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{patient.contactNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Medical Summary
                                    </h4>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md min-h-16">
                                        {patient.medicalHistorySummary || "No significant medical history recorded."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
