import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Building, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function ApproveHospitals() {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await apiClient.get('/hospitals');
                setHospitals(res.data);
            } catch (error) {
                console.error("Failed to fetch hospitals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, []);

    const pendingHospitals = hospitals.filter(h => !h.isActive);
    const activeHospitals = hospitals.filter(h => h.isActive);

    const handleApprove = (id: string) => {
        if (window.confirm("Approve this hospital for platform access?")) {
            setHospitals(prev => prev.map(h =>
                h.id === id ? { ...h, isActive: true } : h
            ));
        }
    };

    const handleReject = (id: string) => {
        if (window.confirm("Reject and delete this registration request?")) {
            setHospitals(prev => prev.filter(h => h.id !== id));
        }
    };

    if (loading) return <div className="p-8">Loading hospital registrations...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Hospital Registrations</h2>
                <p className="text-muted-foreground font-medium mt-1 text-sm">Review incoming facility registrations before granting network access.</p>
            </div>

            {pendingHospitals.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        Pending Approvals ({pendingHospitals.length})
                    </h3>

                    <div className="grid gap-4">
                        {pendingHospitals.map(h => (
                            <div key={h.id} className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                <div>
                                    <h4 className="text-xl font-bold text-foreground">{h.name}</h4>
                                    <p className="text-muted-foreground mt-1">{h.address}</p>
                                    <div className="flex gap-4 mt-3">
                                        <span className="text-sm font-mono bg-card px-2 py-1 rounded border border-amber-200 text-foreground">
                                            Reg No: {h.registrationNumber}
                                        </span>
                                        <span className="text-sm font-mono bg-card px-2 py-1 rounded border border-amber-200 text-foreground">
                                            Contact: {h.contactEmail}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <button
                                        onClick={() => handleReject(h.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-card border border-red-200 text-red-600 font-bold rounded hover:bg-red-50 transition-colors"
                                    >
                                        <XCircle className="h-5 w-5" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(h.id)}
                                        className="flex items-center gap-2 px-6 py-2 bg-green-600 border border-green-700 text-white font-bold rounded hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        <CheckCircle className="h-5 w-5" /> Approve Registration
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4 pt-6 mt-6 border-t border-border">
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
                    Currently Active Network Facilities
                </h3>

                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background border-b border-border text-sm font-semibold text-muted-foreground">
                                <th className="p-4">Facility Name</th>
                                <th className="p-4">Registration No.</th>
                                <th className="p-4">Contact Gateway</th>
                                <th className="p-4 text-right">Documents</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeHospitals.map(h => (
                                <tr key={h.id} className="hover:bg-background transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-foreground flex items-center gap-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            {h.name}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-sm text-muted-foreground">{h.registrationNumber}</td>
                                    <td className="p-4 text-sm text-muted-foreground">{h.contactEmail}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1">
                                            <FileText className="h-4 w-4" /> View Docs
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
