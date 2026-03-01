import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAppointmentsByDate, markCompleted, type Appointment } from "@/api/mockData";
import { CalendarDays, CheckCircle2, AlertTriangle } from "lucide-react";

const AdminAppointments = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>(() => getAppointmentsByDate(today));

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setAppointments(getAppointmentsByDate(newDate));
  };

  const handleMarkCompleted = (id: string) => {
    markCompleted(id);
    setAppointments(getAppointmentsByDate(date));
  };

  const statusColor = (s: string) => {
    if (s === "booked") return "bg-primary/10 text-primary";
    if (s === "completed") return "bg-success/10 text-success";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">View and manage patient appointments</p>
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-4 sm:mt-0 h-12 text-base w-auto"
          />
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No appointments for this date</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <Card key={appt.id} className={appt.isEmergency ? "border-emergency/40 bg-emergency/5" : ""}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{appt.tokenNumber}</span>
                      {appt.isEmergency && (
                        <Badge className="bg-emergency text-emergency-foreground gap-1">
                          <AlertTriangle className="h-3 w-3" /> Emergency
                        </Badge>
                      )}
                      <Badge className={statusColor(appt.status)}>{appt.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground">{appt.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {appt.departmentName} • {appt.timeSlot}
                    </p>
                  </div>
                  {appt.status === "booked" && (
                    <Button
                      onClick={() => handleMarkCompleted(appt.id)}
                      className="gap-2 bg-success hover:bg-success/90 text-success-foreground shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Mark Completed
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

export default AdminAppointments;
