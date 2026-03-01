import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, type Department } from "@/api/mockData";
import { Plus, Building2 } from "lucide-react";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [maxPerSlot, setMaxPerSlot] = useState("20");

  const handleAdd = () => {
    if (!name || !code || !doctorName) return;
    const newDept: Department = {
      id: String(Date.now()),
      name,
      code: code.toUpperCase(),
      doctorName,
      maxPerSlot: parseInt(maxPerSlot) || 20,
    };
    setDepartments([...departments, newDept]);
    DEPARTMENTS.push(newDept);
    setName("");
    setCode("");
    setDoctorName("");
    setMaxPerSlot("20");
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">Manage hospital departments</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Department
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-base">Department Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Neurology" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. NEU" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Doctor Name</Label>
                  <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Raj" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Max Per Slot</Label>
                  <Input type="number" value={maxPerSlot} onChange={(e) => setMaxPerSlot(e.target.value)} className="h-12 text-base" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAdd} className="h-12">Save Department</Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="h-12">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">{dept.doctorName}</p>
                  <p className="text-xs text-muted-foreground">Code: {dept.code} • Max: {dept.maxPerSlot}/slot</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDepartments;
