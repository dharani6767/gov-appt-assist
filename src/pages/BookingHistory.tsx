import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserAppointments, cancelAppointment, type Appointment } from "@/api/mockData";
import { CalendarDays, Clock, Hash, Building2, AlertTriangle, XCircle } from "lucide-react";

const BookingHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    user ? getUserAppointments(user.id) : []
  );

  const handleCancel = (id: string) => {
    try {
      cancelAppointment(id);
      setAppointments(user ? getUserAppointments(user.id) : []);
    } catch {}
  };

  const statusColor = (s: string) => {
    if (s === "booked") return "bg-primary/10 text-primary border-primary/20";
    if (s === "completed") return "bg-success/10 text-success border-success/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-lg text-muted-foreground mb-6">View and manage your appointments</p>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No appointments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <Card key={appt.id} className={appt.isEmergency ? "border-emergency/30" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">{appt.tokenNumber}</span>
                      {appt.isEmergency && (
                        <Badge className="bg-emergency text-emergency-foreground gap-1">
                          <AlertTriangle className="h-3 w-3" /> Emergency
                        </Badge>
                      )}
                    </div>
                    <Badge className={statusColor(appt.status)} variant="outline">
                      {appt.status}
                    </Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{appt.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>
                  {appt.status === "booked" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3 gap-2"
                      onClick={() => handleCancel(appt.id)}
                    >
                      <XCircle className="h-4 w-4" /> Cancel Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingHistory;
