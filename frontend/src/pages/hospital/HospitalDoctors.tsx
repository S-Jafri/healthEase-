import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, MoreVertical, Phone, Mail, Award, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function HospitalDoctors() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitalDoctors = async () => {
            if (!user) return;
            try {
                const adminUser = user as any;
                const docsRes = await apiClient.get('/doctors');
                
                // Filter specifically for this hospital's doctors
                const hospitalDocs = adminUser.hospitalId 
                    ? docsRes.data.filter((d: any) => d.hospitalId === adminUser.hospitalId)
                    : docsRes.data;

                setDoctors(hospitalDocs);
            } catch (error) {
                console.error("Failed to fetch hospital doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitalDoctors();
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
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Doctor Management</h2>
                    <p className="text-muted-foreground">Manage your hospital's associated medical professionals.</p>
                </div>
                <Button>Add New Doctor</Button>
            </div>
            
            {doctors.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No doctors found</h3>
                    <p className="text-muted-foreground">There are currently no doctors registered to your hospital branch.</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-border">
                        {doctors.map((doc) => (
                            <div key={doc.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-muted/30 transition-colors">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-xl text-primary">
                                        {doc.name.replace('Dr. ', '').substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-foreground">{doc.name}</h3>
                                        <Badge variant="outline" className={doc.isActive ? "text-success border-success/30 bg-success/5" : "text-destructive border-destructive/30 bg-destructive/5"}>
                                            {doc.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium text-primary">{doc.specialization} • {doc.qualifications}</p>
                                    
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Award className="h-4 w-4" />
                                            <span>License: {doc.licenseNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{doc.experienceYears} Years Exp.</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            <span>{doc.email}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Manage</Button>
                                    <Button variant="ghost" size="sm" className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive">Suspend</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
