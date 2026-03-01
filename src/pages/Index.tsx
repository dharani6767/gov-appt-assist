import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Hospital, CalendarPlus, Monitor, ShieldCheck } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Hospital className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Government Hospital
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Smart Appointment Booking System
        </p>

        <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/departments")}
                className="h-16 text-lg gap-3"
              >
                <CalendarPlus className="h-6 w-6" />
                {isAdmin ? "Dashboard" : "Book Appointment"}
              </Button>
              <Button
                onClick={() => navigate("/display/live-token")}
                variant="outline"
                className="h-16 text-lg gap-3"
              >
                <Monitor className="h-6 w-6" />
                Live Tokens
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} className="h-16 text-lg gap-3">
                <ShieldCheck className="h-6 w-6" />
                Login
              </Button>
              <Button onClick={() => navigate("/register")} variant="outline" className="h-16 text-lg gap-3">
                <CalendarPlus className="h-6 w-6" />
                Register
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={() => navigate("/display/live-token")}
          variant="ghost"
          className="mt-6 text-muted-foreground"
        >
          <Monitor className="h-4 w-4 mr-2" /> View Live Token Display
        </Button>
      </div>
    </div>
  );
};

export default Index;
