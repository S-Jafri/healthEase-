import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Clock, ToggleLeft, ToggleRight, User, Phone } from "lucide-react";
import { useState } from "react";

const DoctorDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const assignedPatients = [
    { name: "John Smith", condition: "Hypertension", lastVisit: "Feb 20, 2026" },
    { name: "Emily Davis", condition: "Diabetes Type 2", lastVisit: "Feb 22, 2026" },
    { name: "Michael Johnson", condition: "Asthma", lastVisit: "Feb 23, 2026" }
  ];

  const todaysAppointments = [
    {
      patient: "Sarah Wilson",
      time: "9:00 AM",
      type: "Follow-up",
      status: "confirmed"
    },
    {
      patient: "Robert Brown",
      time: "10:30 AM",
      type: "New Patient",
      status: "pending"
    },
    {
      patient: "Lisa Anderson",
      time: "2:00 PM",
      type: "Consultation",
      status: "confirmed"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, Dr. Johnson! 👩‍⚕️
            </h1>
            <p className="text-muted-foreground">
              Your medical practice dashboard
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Availability:</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className="flex items-center space-x-2"
              >
                {isAvailable ? (
                  <ToggleRight className="h-6 w-6 text-success" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                )}
                <span className={`text-sm font-medium ${isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
              <Users className="h-4 w-4 text-primary ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{assignedPatients.length}</div>
              <p className="text-xs text-muted-foreground">Active cases</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-warning ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled visits</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-success ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">9:00 AM</div>
              <p className="text-xs text-muted-foreground">Sarah Wilson</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Assigned Patients */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Assigned Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                      <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{appointment.patient}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.time} - {appointment.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      className={appointment.status === 'confirmed' ? 'bg-success text-success-foreground' : ''}
                    >
                      {appointment.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;