import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLiveTokens } from "@/api/mockData";
import { Hospital, AlertTriangle, Monitor } from "lucide-react";

const LiveTokenDisplay = () => {
  const [tokens, setTokens] = useState(getLiveTokens());

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(getLiveTokens());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-foreground p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Hospital className="h-10 w-10 text-primary-foreground" />
          <h1 className="text-4xl font-bold text-primary-foreground">Live Token Display</h1>
          <div className="h-3 w-3 rounded-full bg-success animate-pulse-slow" />
        </div>
        <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
          <Monitor className="h-5 w-5" /> Government Hospital — Smart Appointment System
        </p>
      </div>

      {/* Token grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {tokens.map((t) => (
          <Card
            key={t.department}
            className={`${
              t.isEmergency ? "border-emergency bg-emergency/10" : "bg-card"
            }`}
          >
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">{t.department}</p>
              <div className="flex items-center justify-center gap-2">
                {t.isEmergency && <AlertTriangle className="h-6 w-6 text-emergency" />}
                <p className={`text-4xl font-bold ${t.isEmergency ? "text-emergency" : "text-primary"}`}>
                  {t.currentToken}
                </p>
              </div>
              {t.isEmergency && (
                <Badge className="mt-2 bg-emergency text-emergency-foreground">EMERGENCY</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Auto-refreshes every 5 seconds • {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default LiveTokenDisplay;
