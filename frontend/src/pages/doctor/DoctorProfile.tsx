import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Doctor } from '../../types';
import { FileBadge, Award, CheckCircle2, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function DoctorProfile() {
    const { user } = useAuth();

    // Cast user to Doctor type
    const doctor = user as Doctor;
    const [hospital, setHospital] = useState<any>(null);
    const [department, setDepartment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!doctor) return;
            try {
                const [hospRes, deptRes] = await Promise.all([
                    apiClient.get('/hospitals'),
                    apiClient.get('/departments')
                ]);
                setHospital(hospRes.data.find((h: any) => h.id === doctor.hospitalId));
                setDepartment(deptRes.data.find((d: any) => d.id === doctor.departmentId));
            } catch (error) {
                console.error("Failed to load doctor dependencies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [doctor]);

    if (loading) return <div className="p-8">Loading profile data...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Professional Profile</h2>
                    <p className="text-muted-foreground">View your verified clinical credentials and settings.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border bg-background/50 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-24 w-24 rounded-2xl bg-card border-2 border-blue-100 shadow-sm flex items-center justify-center text-blue-600 text-4xl font-bold shrink-0">
                        {doctor.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-bold text-foreground">{doctor.name}</h3>
                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-blue-600 font-medium text-lg">{doctor.specialization}</p>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2">
                            <span className="font-semibold text-foreground">{hospital?.name}</span> • {department?.name} Department
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm text-center min-w-[140px]">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span> Active
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                            <Award className="h-5 w-5 text-muted-foreground" /> Qualifications
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Degrees & Certifications</label>
                            <p className="text-foreground font-medium text-lg">{doctor.qualifications}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Clinical Experience</label>
                            <p className="text-foreground font-medium text-lg">{doctor.experienceYears} Years</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                            <FileBadge className="h-5 w-5 text-muted-foreground" /> Practice Info
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Medical License Number</label>
                            <div className="font-mono bg-muted text-foreground px-3 py-1.5 rounded inline-block font-medium border border-border">
                                {doctor.licenseNumber}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Standard Consultation Fee</label>
                            <p className="text-foreground font-bold text-xl">₹{doctor.consultationFee}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Email</label>
                            <p className="text-foreground">{doctor.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
