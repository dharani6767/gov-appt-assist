import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEPARTMENTS, TIME_SLOTS, getSlotCount, bookAppointment } from "@/api/mockData";
import { CalendarDays, Clock, AlertTriangle, Loader2 } from "lucide-react";

const BookAppointment = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const dept = DEPARTMENTS.find((d) => d.id === departmentId);
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!dept) {
    return (
      <Layout>
        <p className="text-center text-lg text-destructive">Department not found.</p>
      </Layout>
    );
  }

  const handleBook = async () => {
    if (!selectedSlot || !user) return;
    setLoading(true);
    setError("");
    try {
      const appt = bookAppointment(user.id, user.name, dept.id, date, selectedSlot, isEmergency);
      navigate("/confirmation", { state: { appointment: appt } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{dept.name}</h1>
          <p className="text-lg text-muted-foreground">{dept.doctorName}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" /> Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={date}
              min={today}
              onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
              className="h-12 text-base max-w-xs"
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" /> Select Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => {
                const booked = getSlotCount(dept.id, date, slot);
                const full = booked >= dept.maxPerSlot;
                return (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    className={`h-14 text-base relative ${full ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={full && !isEmergency}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot}</span>
                      <span className="text-xs opacity-70">{booked}/{dept.maxPerSlot} booked</span>
                    </div>
                    {full && <Badge variant="destructive" className="absolute -top-2 -right-2 text-[10px]">Full</Badge>}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="h-5 w-5 rounded border-input"
              />
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-emergency" />
                <span className="text-base font-medium">Emergency Appointment</span>
              </div>
            </Label>
            {isEmergency && (
              <p className="mt-2 ml-8 text-sm text-emergency">
                Emergency patients get priority tokens (EM-P format) and can book even in full slots.
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handleBook}
          disabled={!selectedSlot || loading}
          className="w-full h-16 text-xl"
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirm Booking"}
        </Button>
      </div>
    </Layout>
  );
};

export default BookAppointment;
