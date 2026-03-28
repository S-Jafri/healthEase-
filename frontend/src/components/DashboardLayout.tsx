import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import {
  Heart, Menu, X, Bell, ChevronDown, LogOut, MessageCircle,
  LayoutDashboard, Calendar, Clock as ClockIcon, Upload, FileText,
  Users, Settings, Search, Building2, BarChart3,
  UserCheck, ShieldCheck, Activity, Stethoscope,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/data/types";
import { useNotifications } from '../context/NotificationContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: Record<UserRole, NavItem[]> = {
  patient: [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Book Appointment', path: '/patient/book', icon: Search },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Live Queue', path: '/patient/queue', icon: ClockIcon },
    { label: 'Upload Reports', path: '/patient/reports', icon: Upload },
    { label: 'AI Chatbot', path: '/patient/chatbot', icon: MessageCircle },
    { label: 'Medical History', path: '/patient/history', icon: FileText },
    { label: 'Notifications', path: '/patient/notifications', icon: Bell },
    { label: 'Profile', path: '/patient/profile', icon: Settings },
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Queue Management', path: '/doctor/queue', icon: Activity },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Availability', path: '/doctor/availability', icon: ClockIcon },
    { label: 'Patients', path: '/doctor/patients', icon: FileText },
    { label: 'Profile', path: '/doctor/profile', icon: Settings },
  ],
  hospital_admin: [
    { label: 'Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
    { label: 'Manage Doctors', path: '/hospital/doctors', icon: Stethoscope },
    { label: 'Appointments', path: '/hospital/appointments', icon: Calendar },
    { label: 'Departments', path: '/hospital/departments', icon: Building2 },
    { label: 'Hospital Info', path: '/hospital/profile', icon: Settings },
  ],
  super_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Doctor Approvals', path: '/admin/approvals', icon: UserCheck },
    { label: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ],
};

const roleLabels: Record<UserRole, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  hospital_admin: 'Hospital Admin',
  super_admin: 'Super Admin',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications: globalNotifications, unreadCount, markAllAsRead } = useNotifications();
  const items = navItems[role];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const isDemoMode = false;

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isDemoMode ? 'pt-10' : ''}`}>
      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 text-center py-1.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <span>You are viewing the app in Demo mode (no backend). All data is mock.</span>
          <Button variant="outline" size="sm" className="h-7 text-xs border-amber-700 text-amber-950 hover:bg-amber-600" onClick={handleLogout}>
            Exit demo
          </Button>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex-shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-1.5">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">HealthEase</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Role badge */}
          <div className="px-4 py-3 border-b border-border">
            <Badge variant="secondary" className="text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {roleLabels[role]}
            </Badge>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border mt-auto">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Top bar */}
          <header className="h-16 bg-card border-b border-border flex items-center px-4 sticky top-0 z-30">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1" />

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <ClockIcon className="h-4 w-4 mr-2" />
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} -{' '}
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <ThemeToggle />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={(e) => { e.preventDefault(); markAllAsRead(); }} 
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {globalNotifications.slice(0, 4).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start p-3 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {!n.read && <span className="h-2 w-2 bg-primary rounded-full" />}
                        <span className="font-medium text-sm">{n.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{n.message}</span>
                      <span className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </DropdownMenuItem>
                  ))}
                  <div className="p-2 border-t border-border text-center">
                    <Link to={`/${role}/notifications`} className="text-xs font-medium text-primary hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm truncate max-w-[100px]">{user?.name ?? 'User'}</span>
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(role === 'hospital_admin' ? '/hospital/profile' : role === 'super_admin' ? '/admin/profile' : `/${role}/profile`)}>
                    <Settings className="h-4 w-4 mr-2" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>

          <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
            © 2026 HealthEase
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
