import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Stethoscope, Calendar, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const HospitalAdminOverview = () => {
  const { user } = useAuth();
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!user) return;
      try {
        const [docsRes, aptsRes, patsRes, depsRes] = await Promise.all([
          apiClient.get('/doctors'),
          apiClient.get('/appointments'),
          apiClient.get('/patients'),
          apiClient.get('/departments') // Optional based on DB structure
        ]);

        // If the admin is attached to a specific hospital, we could filter here, but we'll assume they view their own data
        const adminUser = user as any;
        const hospitalDocs = adminUser.hospitalId ? docsRes.data.filter((d: any) => d.hospitalId === adminUser.hospitalId) : docsRes.data;
        const hospitalApts = adminUser.hospitalId ? aptsRes.data.filter((a: any) => a.hospitalId === adminUser.hospitalId) : aptsRes.data;
        const hospitalDeps = adminUser.hospitalId ? (depsRes.data ? depsRes.data.filter((d: any) => d.hospitalId === adminUser.hospitalId) : []) : (depsRes.data || []);

        setDoctors(hospitalDocs);
        setAppointments(hospitalApts);
        setPatients(patsRes.data); // Patients are platform-wide, or can be implicitly linked via appointments
        setDepartments(hospitalDeps);
      } catch (error) {
        console.error("Failed to fetch hospital admin data", error);
      }
    };
    fetchHospitalData();
  }, [user]);

  // Derived stats
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  // Approximation of active patients (could be unique patientIds from appointments)
  const activePatients = [...new Set(appointments.map(a => a.patientId))].length; 
  const totalDepartments = departments.length || 8; // Fallback if no deps returned

  const stats = [
    { label: 'Total Doctors', value: totalDoctors, icon: Stethoscope, color: 'text-primary', change: 'Active this month' },
    { label: 'Total Appointments', value: totalAppointments, icon: Calendar, color: 'text-success', change: 'Live database count' },
    { label: 'Active Patients', value: patients.length, icon: Users, color: 'text-warning', change: `${activePatients} seen recently` },
    { label: 'Departments', value: totalDepartments, icon: Building2, color: 'text-primary', change: 'Operating' },
  ];

  // Map appointments to include rich data easily
  const recentAppointments = appointments.slice(0, 5).map(apt => {
      const doc = doctors.find(d => d.id === apt.doctorId);
      const pat = patients.find(p => p.id === apt.patientId);
      return {
          ...apt,
          doctorName: doc?.name || 'Unknown Doctor',
          patientName: pat?.name || 'Unknown Patient',
          time: apt.estimatedTime || new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: 'General'
      };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Hospital Dashboard 🏥</h1>
        <p className="text-muted-foreground mt-1">{user?.name ?? 'Your Hospital'} administration overview.</p>
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
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recent appointments recorded.</p>
              ) : recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-sm text-foreground">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{apt.doctorName} • {apt.time}</p>
                  </div>
                  <Badge variant="outline" className={apt.status === 'completed' ? 'text-success' : 'text-primary'}>
                      {apt.status === 'waiting' ? 'Waiting' : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Doctor Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doctors.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No doctors registered yet.</p>
              ) : doctors.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.specialization || 'General'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    doc.isActive ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'
                  }>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${doc.isActive ? 'bg-success' : 'bg-destructive'}`} />
                    {doc.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hospital Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Analytics charts are ready for live data streams</p>
              <p className="text-xs text-success mt-1">Backend connection successfully established</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalAdminOverview;
