import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { DEPARTMENTS } from "@/api/mockData";
import { Stethoscope, ArrowRight } from "lucide-react";

const Departments = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Select Department</h1>
          <p className="mt-2 text-lg text-muted-foreground">Choose a department to book your appointment</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {DEPARTMENTS.map((dept) => (
            <Card
              key={dept.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98]"
              onClick={() => navigate(`/book/${dept.id}`)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Stethoscope className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">{dept.doctorName}</p>
                  <p className="text-xs text-muted-foreground">Code: {dept.code} • Max {dept.maxPerSlot}/slot</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Departments;
