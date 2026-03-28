import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Patient } from '../../types';

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function PatientProfile() {
    const { user } = useAuth();

    // Cast user to Patient type for proper field access
    const patient = user as Patient;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
                    <p className="text-muted-foreground">Manage your personal and medical information.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                        {patient.name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">{patient.name}</h3>
                        <p className="text-muted-foreground">{patient.email}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Age</label>
                        <p className="text-foreground font-medium">{patient.age || 'N/A'} years {patient.dob ? `(Born ${new Date(patient.dob).toLocaleDateString()})` : ''}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Blood Group</label>
                        <p className="text-foreground font-medium">{patient.bloodGroup || 'N/A'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Number</label>
                        <p className="text-foreground font-medium">{patient.contactNumber || 'N/A'}</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Medical History Summary</label>
                        <div className="p-4 bg-background rounded-md border border-border">
                            <p className="text-foreground">{patient.medicalHistorySummary || 'No significant medical history recorded.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
