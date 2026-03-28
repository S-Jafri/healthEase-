import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, Brain, Clock, User, FileText } from "lucide-react";

const PatientDashboard = () => {
  const upcomingAppointments = [
    {
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Feb 28, 2026",
      time: "2:00 PM",
      type: "Follow-up"
    },
    {
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Jan 5, 2025",
      time: "10:30 AM",
      type: "Consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your health journey with HealthEase
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">Book Appointment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule with available doctors
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Find Doctors
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">Upload Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload medical reports for AI analysis
                </p>
              </div>
              <Upload className="h-8 w-8 text-warning" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Upload Files
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">AI Suggestions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  View personalized health insights
                </p>
              </div>
              <Brain className="h-8 w-8 text-success" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Insights
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{appointment.doctor}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {appointment.type}
                    </span>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button className="mt-4">
                  Book Your First Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;