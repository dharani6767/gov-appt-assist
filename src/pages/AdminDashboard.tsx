import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDashboardStats } from "@/api/mockData";
import { CalendarDays, Users, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const AdminDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const stats = getDashboardStats(date);

  const cards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarDays, color: "text-primary" },
    { label: "Available Slots", value: stats.availableSlots, icon: Users, color: "text-secondary" },
    { label: "Completed", value: stats.completedPatients, icon: CheckCircle2, color: "text-success" },
    { label: "Cancelled", value: stats.cancelledBookings, icon: XCircle, color: "text-destructive" },
    { label: "Emergency", value: stats.emergencyCount, icon: AlertTriangle, color: "text-emergency" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-1">Hospital appointment overview</p>
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-4 sm:mt-0 h-12 text-base w-auto"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5 flex flex-col items-center text-center">
                <c.icon className={`h-8 w-8 mb-2 ${c.color}`} />
                <p className="text-3xl font-bold text-foreground">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
