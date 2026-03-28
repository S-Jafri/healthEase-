import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, BarChart3, TrendingUp, Activity } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Patients", value: "1,234", icon: Users, color: "text-primary" },
    { title: "Total Doctors", value: "56", icon: UserCheck, color: "text-success" },
    { title: "Pending Appointments", value: "89", icon: Calendar, color: "text-warning" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard 🏥
          </h1>
          <p className="text-muted-foreground">
            Hospital management overview and analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ml-auto ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hospital Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Patient visits, revenue, and department performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-success" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">New Patient Registration</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson joined</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Appointment Booked</p>
                    <p className="text-sm text-muted-foreground">Dr. Smith - New consultation</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5 min ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Report Analysis Complete</p>
                    <p className="text-sm text-muted-foreground">AI processed blood test results</p>
                  </div>
                  <span className="text-xs text-muted-foreground">8 min ago</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Doctor Status Update</p>
                    <p className="text-sm text-muted-foreground">Dr. Chen marked as available</p>
                  </div>
                  <span className="text-xs text-muted-foreground">12 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;