import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Building2, CheckCircle, XCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorApprovals() {
    const [pendingDocs, setPendingDocs] = useState<any[]>([]);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchApprovals = async () => {
        try {
            const [docsRes, hospsRes] = await Promise.all([
                apiClient.get('/doctors'),
                apiClient.get('/hospitals')
            ]);
            
            // Filter globally for doctors still awaiting approval (isActive = false)
            const unauthorized = docsRes.data.filter((d: any) => !d.isActive);
            setPendingDocs(unauthorized);
            setHospitals(hospsRes.data);
        } catch (error) {
            console.error("Failed to fetch doctor approvals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleApprove = async (doctorId: string, name: string) => {
        try {
            // Updating the isActive flag to True!
            await apiClient.patch(`/doctors/${doctorId}/status`, { isActive: true });
            toast({ title: `Doctor Approved`, description: `${name} has been verified and granted platform access.` });
            
            // Refresh list
            fetchApprovals();
        } catch (error) {
            toast({ title: "Action Failed", description: "Could not approve the doctor. Check network connections.", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Doctor Approvals</h2>
                <p className="text-muted-foreground">Review and verify medical license applications for the platform.</p>
            </div>
            
            {pendingDocs.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">Catching up!</h3>
                    <p className="text-muted-foreground">There are no pending doctor approval requests at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {pendingDocs.map((doc) => {
                        const matchingHosp = hospitals.find(h => h.id === doc.hospitalId);
                        return (
                            <Card key={doc.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start md:items-center mb-2">
                                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                {doc.name}
                                                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">Pending Review</Badge>
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm mt-3">
                                            <div>
                                                <span className="text-muted-foreground mr-2">Specialty:</span>
                                                <span className="font-medium">{doc.specialization} ({doc.qualifications})</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground mr-2">License ID:</span>
                                                <span className="font-medium font-mono bg-muted px-1.5 py-0.5 rounded">{doc.licenseNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">Target Hospital:</span>
                                                <span className="font-medium text-primary">{matchingHosp?.name || 'Unassigned Facility'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground mr-2">Contact:</span>
                                                <span>{doc.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-6 md:w-64 flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border">
                                        <Button 
                                            className="w-full flex items-center gap-2 bg-success hover:bg-success/90 text-success-foreground"
                                            onClick={() => handleApprove(doc.id, doc.name)}
                                        >
                                            <CheckCircle className="h-4 w-4" /> Approve License
                                        </Button>
                                        <Button variant="outline" className="w-full flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                                            <XCircle className="h-4 w-4" /> Reject Case
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
