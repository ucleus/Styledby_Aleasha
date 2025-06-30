import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  CalendarDays, 
  Scissors, 
  Settings, 
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import AdminOverview from './components/AdminOverview';
import AdminAppointments from './components/AdminAppointments';
import AdminServices from './components/AdminServices';
import AdminAvailability from './components/AdminAvailability';
import AdminSettings from './components/AdminSettings';
import AdminClients from './components/AdminClients';

const Dashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout: authLogout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await authLogout();
      // Redirect will be handled by ProtectedRoute
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      window.location.href = '/';
    }
  };

  const navigationItems = [
    { path: '/admin', label: 'Overview', icon: Home },
    { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/clients', label: 'Clients', icon: Users },
    { path: '/admin/availability', label: 'Calendar Management', icon: CalendarDays },
    { path: '/admin/services', label: 'Services', icon: Scissors },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <h1 className="text-xl font-bold font-playfair text-primary">
                Styles by Aleasha
              </h1>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-2">
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {user?.email || 'Aleasha'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={cn(
            "fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block",
            isSidebarOpen ? "md:w-64" : "md:w-16"
          )}>
            <div className="h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <nav className="grid items-start p-4 text-sm font-medium lg:px-4">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        isActive(item.path) && "bg-muted text-primary"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      {isSidebarOpen && (
                        <span className="transition-all duration-200">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-r bg-background">
                <nav className="grid items-start p-4 text-sm font-medium">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isActive(item.path) && "bg-muted text-primary"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="availability" element={<AdminAvailability />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;