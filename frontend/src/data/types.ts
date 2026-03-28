export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'super_admin';

export interface V1User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
}

export interface V1Doctor {
    id: string;
    name: string;
    specialization: string;
    hospital: string;
    hospitalId: string;
    experience: number;
    rating: number;
    reviewCount: number;
    consultationFee: number;
    avatar?: string;
    status: 'online' | 'offline' | 'delayed';
    availableSlots: string[];
    education: string;
    about: string;
    languages: string[];
}

export interface V1Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    departments: string[];
    doctorCount: number;
    rating: number;
    image?: string;
    phone: string;
    email: string;
}

export interface V1Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    tokenNumber: number;
    type: 'consultation' | 'follow-up' | 'emergency';
}

export interface QueueStatus {
    tokenNumber: number;
    currentToken: number;
    estimatedTime: string;
    patientsAhead: number;
    doctorStatus: 'on-time' | 'delayed';
    delayMinutes: number;
}

export interface V1Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'appointment' | 'queue' | 'report' | 'system';
}

export interface Review {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface MedicalRecord {
    id: string;
    name: string;
    type: string;
    date: string;
    doctor: string;
    size: string;
}
