// Mock data for frontend development — will be replaced by real API calls

export interface Department {
  id: string;
  name: string;
  code: string;
  doctorName: string;
  maxPerSlot: number;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  date: string;
  timeSlot: string;
  tokenNumber: string;
  status: "booked" | "completed" | "cancelled";
  isEmergency: boolean;
  createdAt: string;
}

export const DEPARTMENTS: Department[] = [
  { id: "1", name: "General Medicine", code: "GM", doctorName: "Dr. Suresh Reddy", maxPerSlot: 20 },
  { id: "2", name: "Orthopedics", code: "ORT", doctorName: "Dr. Lakshmi Devi", maxPerSlot: 20 },
  { id: "3", name: "Pediatrics", code: "PED", doctorName: "Dr. Ramesh Babu", maxPerSlot: 20 },
  { id: "4", name: "ENT", code: "ENT", doctorName: "Dr. Priya Sharma", maxPerSlot: 20 },
  { id: "5", name: "Dermatology", code: "DRM", doctorName: "Dr. Anil Kumar", maxPerSlot: 20 },
  { id: "6", name: "Ophthalmology", code: "OPH", doctorName: "Dr. Meena Kumari", maxPerSlot: 20 },
  { id: "7", name: "Cardiology", code: "CRD", doctorName: "Dr. Venkat Rao", maxPerSlot: 20 },
  { id: "8", name: "Gynecology", code: "GYN", doctorName: "Dr. Sunita Reddy", maxPerSlot: 20 },
];

export const TIME_SLOTS = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
];

// Simulated booked appointments
let mockAppointments: Appointment[] = [
  {
    id: "a1",
    userId: "2",
    userName: "Ravi Kumar",
    departmentId: "1",
    departmentName: "General Medicine",
    departmentCode: "GM",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "09:00 - 09:30",
    tokenNumber: "GM-1",
    status: "booked",
    isEmergency: false,
    createdAt: new Date().toISOString(),
  },
];

let tokenCounters: Record<string, number> = { GM: 1 };
let emergencyCounter = 0;

export function getSlotCount(departmentId: string, date: string, timeSlot: string): number {
  return mockAppointments.filter(
    (a) => a.departmentId === departmentId && a.date === date && a.timeSlot === timeSlot && a.status !== "cancelled"
  ).length;
}

export function bookAppointment(
  userId: string,
  userName: string,
  departmentId: string,
  date: string,
  timeSlot: string,
  isEmergency: boolean
): Appointment {
  const dept = DEPARTMENTS.find((d) => d.id === departmentId)!;
  const currentCount = getSlotCount(departmentId, date, timeSlot);
  
  if (!isEmergency && currentCount >= dept.maxPerSlot) {
    throw new Error("This slot is fully booked. Please select another slot.");
  }

  // Today check
  const today = new Date().toISOString().split("T")[0];
  if (date < today) throw new Error("Cannot book appointments for past dates.");

  let tokenNumber: string;
  if (isEmergency) {
    emergencyCounter++;
    tokenNumber = `EM-P${emergencyCounter}`;
  } else {
    tokenCounters[dept.code] = (tokenCounters[dept.code] || 0) + 1;
    tokenNumber = `${dept.code}-${tokenCounters[dept.code]}`;
  }

  const appointment: Appointment = {
    id: `a${Date.now()}`,
    userId,
    userName,
    departmentId,
    departmentName: dept.name,
    departmentCode: dept.code,
    date,
    timeSlot,
    tokenNumber,
    status: "booked",
    isEmergency,
    createdAt: new Date().toISOString(),
  };

  mockAppointments.push(appointment);

  // SMS simulation
  console.log(`📱 SMS SENT to ${userName}: Your appointment is confirmed! Token: ${tokenNumber}, Department: ${dept.name}, Date: ${date}, Time: ${timeSlot}`);

  return appointment;
}

export function getUserAppointments(userId: string): Appointment[] {
  return mockAppointments.filter((a) => a.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function cancelAppointment(appointmentId: string): Appointment {
  const appt = mockAppointments.find((a) => a.id === appointmentId);
  if (!appt) throw new Error("Appointment not found");
  appt.status = "cancelled";
  return appt;
}

export function getAllAppointments(): Appointment[] {
  return [...mockAppointments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return mockAppointments.filter((a) => a.date === date).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
}

export function markCompleted(appointmentId: string): Appointment {
  const appt = mockAppointments.find((a) => a.id === appointmentId);
  if (!appt) throw new Error("Appointment not found");
  appt.status = "completed";
  return appt;
}

export function getDashboardStats(date: string) {
  const todayAppts = mockAppointments.filter((a) => a.date === date);
  const booked = todayAppts.filter((a) => a.status === "booked").length;
  const completed = todayAppts.filter((a) => a.status === "completed").length;
  const cancelled = todayAppts.filter((a) => a.status === "cancelled").length;
  const totalSlots = DEPARTMENTS.length * TIME_SLOTS.length * 20;
  const usedSlots = todayAppts.filter((a) => a.status !== "cancelled").length;

  return {
    totalBookings: booked + completed,
    availableSlots: totalSlots - usedSlots,
    completedPatients: completed,
    cancelledBookings: cancelled,
    emergencyCount: todayAppts.filter((a) => a.isEmergency && a.status !== "cancelled").length,
  };
}

export function getLiveTokens(): Array<{ department: string; currentToken: string; isEmergency: boolean }> {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = mockAppointments.filter((a) => a.date === today && a.status !== "cancelled");

  const deptTokens = DEPARTMENTS.map((dept) => {
    const deptAppts = todayAppts
      .filter((a) => a.departmentId === dept.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const lastCompleted = deptAppts.filter((a) => a.status === "completed").pop();
    const nextBooked = deptAppts.find((a) => a.status === "booked");
    const current = lastCompleted || nextBooked;
    return {
      department: dept.name,
      currentToken: current?.tokenNumber || "—",
      isEmergency: current?.isEmergency || false,
    };
  });

  return deptTokens;
}
