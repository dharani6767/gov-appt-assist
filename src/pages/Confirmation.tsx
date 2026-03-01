import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/api/mockData";
import { CheckCircle2, CalendarDays, Clock, Hash, Building2, AlertTriangle } from "lucide-react";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = (location.state as any)?.appointment as Appointment | undefined;

  if (!appointment) return <Navigate to="/departments" replace />;

  return (
    <Layout>
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-muted-foreground">Your appointment has been successfully booked</p>
        </div>

        <Card className="mb-6 text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Token Number</span>
              <div className="flex items-center gap-2">
                {appointment.isEmergency && (
                  <Badge className="bg-emergency text-emergency-foreground gap-1">
                    <AlertTriangle className="h-3 w-3" /> Emergency
                  </Badge>
                )}
                <span className="text-2xl font-bold text-primary">{appointment.tokenNumber}</span>
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{appointment.departmentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-medium">{appointment.timeSlot}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">{appointment.status}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate("/departments")} className="h-14 text-lg">
            Book Another Appointment
          </Button>
          <Button onClick={() => navigate("/history")} variant="outline" className="h-12 text-base">
            View My Bookings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;
