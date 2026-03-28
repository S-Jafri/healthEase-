export type Role = "PATIENT" | "DOCTOR" | "HOSPITAL_ADMIN" | "SUPER_ADMIN";

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    contactNumber?: string;
}

export interface Patient extends User {
    role: "PATIENT";
    age: number;
    dob?: string;
    bloodGroup: string;
    medicalHistorySummary: string;
}

export interface Doctor extends User {
    role: "DOCTOR";
    hospitalId: string;
    departmentId: string;
    qualifications: string; // e.g. "MBBS, MD"
    specialization: string;
    experienceYears: number;
    licenseNumber: string;
    consultationFee: number;
    isActive: boolean;
}

export interface HospitalAdmin extends User {
    role: "HOSPITAL_ADMIN";
    hospitalId: string;
}

export interface SuperAdmin extends User {
    role: "SUPER_ADMIN";
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    registrationNumber: string;
    contactEmail: string;
    isActive: boolean;
}

export interface Department {
    id: string;
    hospitalId: string;
    name: string;
}

export type AppointmentStatus = "waiting" | "completed" | "cancelled" | "skipped";

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    date: string; // ISO String
    tokenNumber: number;
    status: AppointmentStatus;
    estimatedTime?: string; // HH:mm
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}
