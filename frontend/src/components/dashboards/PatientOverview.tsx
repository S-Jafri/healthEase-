import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, Clock, Upload, Activity, Users, ArrowRight,
  Timer, Hash, AlertTriangle, CheckCircle2, CalendarX2
} from "lucide-react";
import { motion } from "framer-motion";

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const stepTime = Math.max(Math.floor(duration / end), 30);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    'on-time': 'bg-success/10 text-success border-success/20',
    'delayed': 'bg-warning/10 text-warning border-warning/20',
    'online': 'bg-success/10 text-success border-success/20',
    'offline': 'bg-muted text-muted-foreground border-border',
  };
  return (
    <Badge variant="outline" className={variants[status] || variants['offline']}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${status === 'on-time' || status === 'online' ? 'bg-success' : status === 'delayed' ? 'bg-warning' : 'bg-muted-foreground'}`} />
      {status === 'on-time' ? 'On Time' : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const PatientOverview = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  const [currentRunningToken, setCurrentRunningToken] = useState<number>(0);
  const [estimatedDelay, setEstimatedDelay] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [aptRes, docRes, hospRes] = await Promise.all([
          apiClient.get('/appointments'),
          apiClient.get('/doctors'),
          apiClient.get('/hospitals')
        ]);

        // All specific patient appointments
        const myApts = aptRes.data.filter((a: any) => a.patientId === user.id);
        setDoctors(docRes.data);
        setHospitals(hospRes.data);

        // Get all scheduled/waiting appointments
        const upcoming = myApts.filter((a: any) => a.status === 'scheduled' || a.status === 'waiting');
        setUpcomingAppointments(upcoming);

        // Find if there is an active waiting appointment TODAY
        const todayStr = new Date().toISOString().split('T')[0];
        const activeApt = upcoming.find((apt: any) => apt.status === 'waiting' && apt.date.split('T')[0] === todayStr);

        if (activeApt) {
          setActiveAppointment(activeApt);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // WebSocket Connection for the Active Queue
  useEffect(() => {
    if (!activeAppointment) return;

    const wsUrl = `ws://localhost:8000/ws/queue/${activeAppointment.doctorId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Dashboard connected to Live Queue");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'QUEUE_UPDATE') {
          setCurrentRunningToken(data.currentToken);
          if (data.delayMinutes !== undefined) {
            setEstimatedDelay(data.delayMinutes);
          }
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [activeAppointment]);

  if (loading) return <div className="p-8">Loading overview...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0] || 'Patient'}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your health overview for today.</p>
      </div>

      {/* Queue Status Card */}
      {activeAppointment ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ActivityCustom className="h-5 w-5 text-primary" />
                  Live Queue Status
                </CardTitle>
                <StatusBadge status={estimatedDelay > 0 ? "delayed" : "on-time"} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Hash className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={activeAppointment.tokenNumber} /></p>
                  <p className="text-xs text-muted-foreground">Your Token</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={currentRunningToken || 1} /></p>
                  <p className="text-xs text-muted-foreground">Current Token</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Timer className="h-5 w-5 text-warning mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">{activeAppointment.estimatedTime || 'Pending'}</p>
                  <p className="text-xs text-muted-foreground">Est. Waiting Time</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Users className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={Math.max(0, activeAppointment.tokenNumber - (currentRunningToken || 1))} />
                  </p>
                  <p className="text-xs text-muted-foreground">Ahead of You</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Queue Progress</span>
                  <span className="font-medium text-foreground">{currentRunningToken || 1}/{activeAppointment.tokenNumber}</span>
                </div>
                <Progress value={((currentRunningToken || 1) / activeAppointment.tokenNumber) * 100} className="h-3" />
              </div>

              {estimatedDelay > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-warning bg-warning/10 px-3 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  Doctor is running {estimatedDelay} minutes behind schedule
                </div>
              )}

              <div className="mt-4">
                <Link to="/patient/queue" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View full dedicated queue interface <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="bg-muted/50 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <CalendarX2 className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-foreground text-lg mb-1">No Active Queues Today</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">You do not have any appointments scheduled for today. Book an appointment to track your live token.</p>
            <Button asChild variant="outline">
              <Link to="/patient/book">Book Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Book Appointment', desc: 'Find & book doctors', icon: Calendar, path: '/patient/book', color: 'text-primary' },
          { title: 'Upload Reports', desc: 'Upload medical documents', icon: Upload, path: '/patient/reports', color: 'text-success' },
        ].map((action, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1) }}>
            <Link to={action.path}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="p-5 flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/patient/appointments">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 border-t border-border">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">You don't have any upcoming appointments.</p>
              <Button className="mt-4" asChild><Link to="/patient/book">Book Now</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((apt) => {
                const doctor = doctors.find(d => d.id === apt.doctorId);
                const hospital = hospitals.find(h => h.id === apt.hospitalId);

                return (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{doctor?.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor?.specialization} • {hospital?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Token #{apt.tokenNumber}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ActivityCustom = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
);

export default PatientOverview;
