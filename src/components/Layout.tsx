import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Hospital,
  LogOut,
  CalendarPlus,
  History,
  LayoutDashboard,
  Monitor,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = isAdmin
    ? [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Appointments", path: "/admin/appointments", icon: CalendarPlus },
        { label: "Departments", path: "/admin/departments", icon: Hospital },
        { label: "Live Tokens", path: "/display/live-token", icon: Monitor },
      ]
    : [
        { label: "Book Appointment", path: "/departments", icon: CalendarPlus },
        { label: "My Bookings", path: "/history", icon: History },
        { label: "Live Tokens", path: "/display/live-token", icon: Monitor },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Hospital className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight text-foreground">
                Govt. Hospital
              </h1>
              <p className="text-xs text-muted-foreground">Appointment System</p>
            </div>
          </Link>

          {isAuthenticated && (
            <>
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile nav dropdown */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start gap-3 text-base h-12"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Government Hospital — Smart Appointment Booking System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
