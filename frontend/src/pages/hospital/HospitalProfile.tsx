import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { HospitalAdmin } from '../../types';
import { Building2, MapPin, Hash, Mail, FileText, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HospitalProfile() {
    const { user } = useAuth();

    // Cast user to HospitalAdmin type
    const admin = user as HospitalAdmin;
    const [hospital, setHospital] = useState<any>(null);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!admin) return;
            try {
                const [hospRes, deptRes] = await Promise.all([
                    apiClient.get('/hospitals'),
                    apiClient.get('/departments')
                ]);
                setHospital(hospRes.data.find((h: any) => h.id === admin.hospitalId));
                setDepartments(deptRes.data.filter((d: any) => d.hospitalId === admin.hospitalId));
            } catch (error) {
                console.error("Failed to load hospital dependencies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [admin]);

    if (loading) return <div className="p-8">Loading facility profile...</div>;
    if (!hospital) return <div className="p-8">Hospital not found.</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Hospital Registration Profile</h2>
                    <p className="text-muted-foreground">View your facility's verified credentials and contact information.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border bg-teal-50/30 flex items-start gap-6">
                    <div className="h-20 w-20 rounded-xl bg-teal-100 border border-teal-200 shadow-sm flex items-center justify-center text-teal-700 shrink-0">
                        <Building2 className="h-10 w-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-foreground">{hospital.name}</h3>
                            {hospital.isActive && (
                                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                    VERIFIED
                                </span>
                            )}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                            {hospital.address}
                        </p>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-foreground border-b border-border pb-2">
                            Registration Info
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                                <Hash className="h-4 w-4" /> Govt. Registration Number
                            </label>
                            <div className="font-mono bg-muted text-foreground px-3 py-1.5 rounded inline-block font-semibold border border-border">
                                {hospital.registrationNumber}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                                <Mail className="h-4 w-4" /> Primary Contact Email
                            </label>
                            <p className="text-foreground font-medium">{hospital.contactEmail}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-foreground border-b border-border pb-2">
                            Infrastructure Summary
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                                <FileText className="h-4 w-4" /> Registered Departments
                            </label>
                            <p className="text-foreground font-bold text-2xl">{departments.length}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Facility Administrator</label>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center font-bold text-muted-foreground">
                                    {admin.name.charAt(0)}
                                </div>
                                <p className="text-foreground font-medium">{admin.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
