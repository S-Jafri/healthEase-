import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Hash, Users, Clock, SkipForward, CheckCircle,
  AlertTriangle, Timer, Calendar, Stethoscope,
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

const DoctorOverview = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [delayMinutes, setDelayMinutes] = useState(0);

  const fetchQueueData = async () => {
    if (!user) return;
    try {
        const [aptRes, patRes] = await Promise.all([
            apiClient.get('/appointments'),
            apiClient.get('/patients')
        ]);
        setAppointments(aptRes.data);
        setPatients(patRes.data);
    } catch (error) {
        console.error("Failed to fetch queue data", error);
    }
  };

  useEffect(() => {
    fetchQueueData();
    // Poll every 10 seconds for real-time queue synchronization from the dashboard
    const interval = setInterval(fetchQueueData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Retrieve today's appointments for the logged-in doctor
  const todaysAppointments = appointments
    .filter(apt => apt.doctorId === user?.id)
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  const totalTokens = todaysAppointments.length;
  const completedTokens = todaysAppointments.filter(a => ['completed', 'skipped', 'consulted'].includes(a.status)).length;
  
  // Find the currently active tokens
  const waitingAppointments = todaysAppointments.filter(apt => apt.status === 'waiting');
  const currentAppointment = waitingAppointments.length > 0 ? waitingAppointments[0] : null;
  const nextAppointment = waitingAppointments.length > 1 ? waitingAppointments[1] : null;

  const currentToken = currentAppointment ? currentAppointment.tokenNumber : (totalTokens > 0 ? totalTokens + 1 : 1);
  const currentPatientObj = currentAppointment ? patients.find(p => p.id === currentAppointment.patientId) : null;
  const nextPatientObj = nextAppointment ? patients.find(p => p.id === nextAppointment.patientId) : null;

  const handleUpdateStatus = async (status: string) => {
    if (!currentAppointment) return;
    try {
        await apiClient.patch(`/appointments/${currentAppointment.id}/status`, { status });
        // Let the polling handle updating, or manually fetch immediately for responsiveness
        fetchQueueData();
    } catch (error) {
        console.error(`Failed to mark appointment as ${status}`, error);
    }
  };

  const handleComplete = () => handleUpdateStatus('completed');
  const handleSkip = () => handleUpdateStatus('skipped');
  const handleAddDelay = () => setDelayMinutes(prev => prev + 5);

  const stats = [
    { label: "Today's Patients", value: totalTokens, icon: Users, color: 'text-primary' },
    { label: 'Current Token', value: currentAppointment ? currentToken : '-', icon: Hash, color: 'text-success' },
    { label: 'Remaining', value: waitingAppointments.length, icon: Clock, color: 'text-warning' },
    { label: 'Completed', value: completedTokens, icon: CheckCircle, color: 'text-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Good Morning, {user?.name ?? 'Doctor'}! 👩‍⚕️</h1>
          <p className="text-muted-foreground mt-1">You have {totalTokens} appointments today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Availability</span>
          <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          <Badge variant="outline" className={isAvailable ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
            {isAvailable ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Queue Management */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Live Queue Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedTokens}/{totalTokens} completed</span>
            </div>
            <Progress value={totalTokens > 0 ? (completedTokens / totalTokens) * 100 : 0} className="h-3" />
          </div>

          {/* Current & Next */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
              <p className="text-xs text-muted-foreground mb-1">CURRENT PATIENT</p>
              {currentAppointment ? (
                <>
                  <p className="font-semibold text-foreground text-lg">{currentPatientObj?.name || 'Unknown Patient'}</p>
                  <p className="text-sm text-muted-foreground">Token #{currentAppointment.tokenNumber} • General Consultation</p>
                  <p className="text-sm text-muted-foreground">{currentAppointment.estimatedTime || currentAppointment.date}</p>
                </>
              ) : (
                <p className="text-muted-foreground mt-2">No active patients waiting.</p>
              )}
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">NEXT PATIENT</p>
              {nextAppointment ? (
                <>
                  <p className="font-semibold text-foreground text-lg">{nextPatientObj?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">Token #{nextAppointment.tokenNumber} • General</p>
                  <p className="text-sm text-muted-foreground">{nextAppointment.estimatedTime || nextAppointment.date}</p>
                </>
              ) : (
                <p className="text-muted-foreground mt-2">No upcoming patients.</p>
              )}
            </div>
          </div>

          {/* Delay */}
          {delayMinutes > 0 && (
            <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              Running {delayMinutes} minutes behind schedule
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleComplete} disabled={!currentAppointment} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark Completed
            </Button>
            <Button variant="outline" onClick={handleSkip} disabled={!currentAppointment} className="gap-2">
              <SkipForward className="h-4 w-4" />
              Skip Patient
            </Button>
            <Button variant="outline" onClick={handleAddDelay} className="gap-2">
              <Timer className="h-4 w-4" />
              Add 5 min Delay
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysAppointments.length === 0 ? (
                <p className="text-muted-foreground text-sm">You have no appointments scheduled for today.</p>
            ) : todaysAppointments.map((apt) => {
              const pData = patients.find(p => p.id === apt.patientId);
              
              // Define dynamic styling purely based on status and token iteration logic
              let rowStyle = 'border-border hover:bg-muted/50';
              let badgeStyle = 'bg-primary/10 text-primary';
              let badgeText = 'Waiting';
              let tokenStyle = 'bg-muted text-foreground';

              if (apt.status === 'completed' || apt.status === 'skipped') {
                  rowStyle = 'border-border bg-muted/30 opacity-60';
                  badgeStyle = 'bg-success/10 text-success';
                  badgeText = apt.status.charAt(0).toUpperCase() + apt.status.slice(1);
                  tokenStyle = 'bg-muted text-muted-foreground';
              } else if (apt.id === currentAppointment?.id) {
                  rowStyle = 'border-primary bg-primary/5';
                  badgeStyle = 'bg-primary text-primary-foreground';
                  badgeText = 'In Progress';
                  tokenStyle = 'bg-primary text-primary-foreground';
              }
              
              return (
                <div
                    key={apt.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${rowStyle}`}
                >
                    <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${tokenStyle}`}>
                        {apt.tokenNumber}
                    </div>
                    <div>
                        <p className="font-medium text-sm text-foreground">{pData?.name || 'Unknown Patient'}</p>
                        <p className="text-xs text-muted-foreground">{apt.estimatedTime || apt.date} • General</p>
                    </div>
                    </div>
                    <Badge variant={apt.id === currentAppointment?.id ? 'default' : 'outline'} className={badgeStyle}>
                        {badgeText}
                    </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOverview;
