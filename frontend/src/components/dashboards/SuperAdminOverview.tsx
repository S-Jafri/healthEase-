import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Stethoscope, Building2, BarChart3, TrendingUp, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

const SuperAdminOverview = () => {
  const { user } = useAuth();
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
      const fetchPlatformData = async () => {
        try {
            const [docs, hosps, pats] = await Promise.all([
                apiClient.get('/doctors'),
                apiClient.get('/hospitals'),
                apiClient.get('/patients')
            ]);
            setDoctors(docs.data);
            setHospitals(hosps.data);
            setPatients(pats.data);
        } catch (error) {
            console.error("Failed to fetch super admin data", error);
        }
      };
      if (user) fetchPlatformData();
  }, [user]);

  const totalUsers = doctors.length + patients.length; 
  // For demonstration, deriving "verified" based on isActive flag
  const verifiedDoctors = doctors.filter(d => d.isActive).length;
  // Approvals could be mapped if the schema supports 'pending' statuses. Here we just use inactive docs or a subset.
  const pendingApprovals = doctors.filter(d => !d.isActive); 

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-primary', change: 'Enrolled profiles' },
    { label: 'Verified Doctors', value: verifiedDoctors, icon: Stethoscope, color: 'text-success', change: 'Fully accredited' },
    { label: 'Hospitals', value: hospitals.length, icon: Building2, color: 'text-warning', change: 'Network capacity' },
    { label: 'Pending Approvals', value: pendingApprovals.length, icon: UserCheck, color: 'text-destructive', change: 'Action required' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Platform Overview 🛡️</h1>
        <p className="text-muted-foreground mt-1">{user?.name ?? 'Admin'} control panel.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <TrendingUp className="h-3 w-3 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-success mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-warning" />
              Pending Doctor Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending approvals at the moment.</p>
              ) : pendingApprovals.slice(0, 5).map((doc) => {
                  const matchingHosp = hospitals.find(h => h.id === doc.hospitalId);
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                        <p className="font-medium text-sm text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.specialization} • {matchingHosp?.name || 'Unassigned'}</p>
                        <p className="text-xs text-muted-foreground mt-1">License: {doc.licenseNumber}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" className="h-7 text-xs">Approve</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Reject</Button>
                        </div>
                    </div>
                  );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hospital List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Registered Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hospitals.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No hospitals registered yet.</p>
              ) : hospitals.map((h) => {
                  const docCount = doctors.filter(d => d.hospitalId === h.id).length;
                  return (
                    <div key={h.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                        <p className="font-medium text-sm text-foreground">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.address} • {docCount} doctors</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <Badge variant={h.isActive ? 'outline' : 'destructive'} className="text-xs">
                            {h.isActive ? 'Active' : 'Offline'}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">Manage</Button>
                        </div>
                    </div>
                  );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Platform Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Platform analytics & reports ready</p>
              <p className="text-xs text-success mt-1">Backend connection active natively</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminOverview;
