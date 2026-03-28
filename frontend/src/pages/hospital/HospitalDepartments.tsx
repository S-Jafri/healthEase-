import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { HospitalAdmin } from '../../types';
import { Stethoscope, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function HospitalDepartments() {
    const { user } = useAuth();
    const admin = user as HospitalAdmin;

    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDeptId, setOpenDeptId] = useState<string | null>(null);

    useEffect(() => {
        const fetchHospitalAssets = async () => {
            if (!admin) return;
            try {
                const [deptRes, docRes] = await Promise.all([
                    apiClient.get('/departments'),
                    apiClient.get('/doctors')
                ]);

                const myDepts = deptRes.data.filter((d: any) => d.hospitalId === admin.hospitalId);
                setDepartments(myDepts);
                setDoctors(docRes.data.filter((doc: any) => doc.hospitalId === admin.hospitalId));

                if (myDepts.length > 0) setOpenDeptId(myDepts[0].id);
            } catch (error) {
                console.error("Failed to load departments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHospitalAssets();
    }, [admin]);

    const toggleDept = (id: string) => {
        setOpenDeptId(prev => (prev === id ? null : id));
    };

    if (loading) return <div className="p-8">Loading departments...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Departments & Doctors</h2>
                    <p className="text-muted-foreground">View your active departments and the doctors assigned to them.</p>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium transition-colors shadow-sm">
                    + Add Department
                </button>
            </div>

            <div className="space-y-4">
                {departments.length === 0 ? (
                    <div className="bg-card p-12 text-center rounded-lg border border-border shadow-sm text-muted-foreground">
                        No departments registered for this hospital yet.
                    </div>
                ) : (
                    departments.map(dept => {
                        const deptDoctors = doctors.filter(doc => doc.departmentId === dept.id);
                        const isOpen = openDeptId === dept.id;

                        return (
                            <div key={dept.id} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all">
                                <button
                                    onClick={() => toggleDept(dept.id)}
                                    className="w-full flex items-center justify-between p-5 bg-card hover:bg-background transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                            <Stethoscope className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-foreground">{dept.name}</h3>
                                            <p className="text-sm text-muted-foreground">{deptDoctors.length} Assigned Doctors</p>
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground mr-4">
                                        {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-border bg-background/50 p-5 p-r-0">
                                        {deptDoctors.length === 0 ? (
                                            <p className="text-muted-foreground text-sm italic py-4 pl-4">No doctors currently assigned to this department.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {deptDoctors.map(doc => (
                                                    <div key={doc.id} className="bg-card border border-border rounded-md p-4 shadow-sm flex items-start gap-4">
                                                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shrink-0">
                                                            <User className="h-6 w-6" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className="font-bold text-foreground truncate" title={doc.name}>{doc.name}</h4>
                                                            <p className="text-xs text-blue-600 font-semibold mb-1 truncate">{doc.specialization}</p>
                                                            <p className="text-xs text-muted-foreground font-mono bg-muted inline-block px-1.5 py-0.5 rounded">{doc.licenseNumber}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-border/60 text-right">
                                            <button className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                                                + Add Doctor to {dept.name}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
