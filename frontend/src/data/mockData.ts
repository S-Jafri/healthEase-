import { Hospital, Department, Doctor, Patient, Appointment, Notification } from "../types";
import { V1Doctor, V1Hospital, V1Appointment, QueueStatus, V1Notification, Review, MedicalRecord } from "./types";

export const MOCK_HOSPITALS: Hospital[] = [
    {
        id: "h-1",
        name: "Swaroop Rani Nehru (SRN) Hospital",
        address: "MG Marg, Civil Lines, Prayagraj, UP - 211001",
        registrationNumber: "UP-PRJ-Gov-001",
        contactEmail: "admin@srnhospital.gov.in",
        isActive: true,
    },
    {
        id: "h-2",
        name: "Kamla Nehru Memorial Hospital",
        address: "Hashimpur Road, Tagore Town, Prayagraj, UP - 211002",
        registrationNumber: "UP-PRJ-Pvt-042",
        contactEmail: "contact@knmh.org",
        isActive: true,
    },
    {
        id: "h-3",
        name: "Jeevan Jyoti Hospital",
        address: "Bai-Ka-Bagh, Prayagraj, UP - 211003",
        registrationNumber: "UP-PRJ-Pvt-015",
        contactEmail: "info@jeevanjyoti.in",
        isActive: true,
    }
];

export const MOCK_DEPARTMENTS: Department[] = [
    { id: "d-1", hospitalId: "h-1", name: "Cardiology" },
    { id: "d-2", hospitalId: "h-1", name: "Neurology" },
    { id: "d-3", hospitalId: "h-2", name: "Oncology" },
    { id: "d-4", hospitalId: "h-2", name: "Gynecology" },
    { id: "d-5", hospitalId: "h-3", name: "Orthopedics" },
    { id: "d-6", hospitalId: "h-3", name: "General Medicine" },
];

export const MOCK_DOCTORS: Doctor[] = [
    {
        id: "doc-1",
        email: "dr.sharma@srn.gov.in",
        name: "Dr. Arvind Sharma",
        role: "DOCTOR",
        contactNumber: "+91-9876543210",
        hospitalId: "h-1",
        departmentId: "d-1",
        qualifications: "MBBS, MD (Cardiology), DM",
        specialization: "Cardiologist",
        experienceYears: 18,
        licenseNumber: "UPMC-45123",
        consultationFee: 500,
        isActive: true,
    },
    {
        id: "doc-2",
        email: "dr.verma@srn.gov.in",
        name: "Dr. Sunita Verma",
        role: "DOCTOR",
        contactNumber: "+91-9876543211",
        hospitalId: "h-1",
        departmentId: "d-2",
        qualifications: "MBBS, MS (Neurology)",
        specialization: "Neurologist",
        experienceYears: 12,
        licenseNumber: "UPMC-45892",
        consultationFee: 500,
        isActive: true,
    },
    {
        id: "doc-3",
        email: "dr.rastogi@knmh.org",
        name: "Dr. Manish Rastogi",
        role: "DOCTOR",
        contactNumber: "+91-9876543212",
        hospitalId: "h-2",
        departmentId: "d-3",
        qualifications: "MBBS, MS, MCh (Surgical Oncology)",
        specialization: "Oncologist",
        experienceYears: 20,
        licenseNumber: "UPMC-12093",
        consultationFee: 800,
        isActive: true,
    },
    {
        id: "doc-4",
        email: "dr.yadav@jeevanjyoti.in",
        name: "Dr. Ramesh Yadav",
        role: "DOCTOR",
        contactNumber: "+91-9876543213",
        hospitalId: "h-3",
        departmentId: "d-5",
        qualifications: "MBBS, MS (Orthopedics)",
        specialization: "Orthopedic Surgeon",
        experienceYears: 15,
        licenseNumber: "UPMC-67341",
        consultationFee: 600,
        isActive: true,
    }
];

export const MOCK_PATIENTS: Patient[] = [
    {
        id: "pat-1",
        email: "rahul.singh@email.com",
        name: "Rahul Singh",
        role: "PATIENT",
        contactNumber: "+91-9123456789",
        age: 45,
        bloodGroup: "O+",
        medicalHistorySummary: "Diagnosed with mild hypertension in 2022. No known allergies.",
    },
    {
        id: "pat-2",
        email: "priya.mishra@email.com",
        name: "Priya Mishra",
        role: "PATIENT",
        contactNumber: "+91-9988776655",
        age: 32,
        bloodGroup: "A+",
        medicalHistorySummary: "Frequent migraines. Previously prescribed Paracetamol and Rest.",
    }
];

// Seed some active appointments for testing the Smart Queue
export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: "apt-1",
        patientId: "pat-1",
        doctorId: "doc-1",
        hospitalId: "h-1",
        date: new Date().toISOString(),
        tokenNumber: 14,
        status: "waiting",
        estimatedTime: "11:30",
    },
    {
        id: "apt-2",
        patientId: "pat-2",
        doctorId: "doc-1",
        hospitalId: "h-1",
        date: new Date().toISOString(),
        tokenNumber: 15,
        status: "waiting",
        estimatedTime: "11:45",
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "notif-1",
        userId: "pat-1",
        title: "Appointment Confirmed",
        message: "Your appointment with Dr. Arvind Sharma is confirmed for today. Token #14.",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: false,
    }
];

// --- V1 MOCK DATA FOR OVERVIEWS ---

export const doctors: V1Doctor[] = [
    {
        id: 'd1', name: 'Dr. Sarah Johnson', specialization: 'Cardiologist',
        hospital: 'City General Hospital', hospitalId: 'h1', experience: 12, rating: 4.8,
        reviewCount: 234, consultationFee: 500, status: 'online',
        availableSlots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:00 PM'],
        education: 'MD - Cardiology, AIIMS Delhi', about: 'Experienced cardiologist specializing in interventional cardiology and heart failure management.',
        languages: ['English', 'Hindi'],
    },
    {
        id: 'd2', name: 'Dr. Michael Chen', specialization: 'Neurologist',
        hospital: 'Metro Healthcare', hospitalId: 'h2', experience: 8, rating: 4.6,
        reviewCount: 156, consultationFee: 600, status: 'online',
        availableSlots: ['11:00 AM', '1:00 PM', '3:30 PM'],
        education: 'MD - Neurology, Johns Hopkins', about: 'Specializes in stroke treatment and neurodegenerative disorders.',
        languages: ['English', 'Mandarin'],
    },
    {
        id: 'd3', name: 'Dr. Priya Sharma', specialization: 'Dermatologist',
        hospital: 'City General Hospital', hospitalId: 'h1', experience: 6, rating: 4.9,
        reviewCount: 312, consultationFee: 400, status: 'delayed',
        availableSlots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
        education: 'MD - Dermatology, Stanford', about: 'Expert in cosmetic dermatology and skin cancer treatment.',
        languages: ['English', 'Hindi', 'Tamil'],
    }
];

export const hospitals: V1Hospital[] = [
    {
        id: 'h1', name: 'City General Hospital', address: '123 Medical Drive, Downtown',
        city: 'New York', departments: ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics'],
        doctorCount: 45, rating: 4.7, phone: '+1 (555) 100-2000', email: 'info@citygeneral.com',
    }
];

export const patientAppointments: V1Appointment[] = [
    { id: 'a1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Sarah Johnson', specialization: 'Cardiologist', hospital: 'City General Hospital', date: '2026-02-27', time: '10:30 AM', status: 'upcoming', tokenNumber: 15, type: 'consultation' },
    { id: 'a2', patientId: 'p1', patientName: 'John Doe', doctorId: 'd3', doctorName: 'Dr. Priya Sharma', specialization: 'Dermatologist', hospital: 'City General Hospital', date: '2026-03-01', time: '3:00 PM', status: 'upcoming', tokenNumber: 8, type: 'follow-up' },
    { id: 'a3', patientId: 'p1', patientName: 'John Doe', doctorId: 'd5', doctorName: 'Dr. Anita Patel', specialization: 'Pediatrician', hospital: 'Metro Healthcare', date: '2026-02-20', time: '11:00 AM', status: 'completed', tokenNumber: 5, type: 'consultation' }
];

export const doctorAppointments: V1Appointment[] = [
    { id: 'da1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Sarah Johnson', specialization: 'Cardiologist', hospital: 'City General Hospital', date: '2026-02-27', time: '9:00 AM', status: 'upcoming', tokenNumber: 1, type: 'consultation' },
    { id: 'da2', patientId: 'p2', patientName: 'Jane Smith', doctorId: 'd1', doctorName: 'Dr. Sarah Johnson', specialization: 'Cardiologist', hospital: 'City General Hospital', date: '2026-02-27', time: '9:30 AM', status: 'upcoming', tokenNumber: 2, type: 'follow-up' }
];

export const queueStatus: QueueStatus = {
    tokenNumber: 15,
    currentToken: 11,
    estimatedTime: '45 min',
    patientsAhead: 4,
    doctorStatus: 'delayed',
    delayMinutes: 10,
};

export const notifications: V1Notification[] = [
    { id: 'n1', title: 'Appointment Reminder', message: 'Your appointment is tomorrow', time: '2 hours ago', read: false, type: 'appointment' },
    { id: 'n2', title: 'Queue Update', message: 'Your token #15 is now 4 positions away', time: '30 min ago', read: false, type: 'queue' }
];

export const reviews: Review[] = [
    { id: 'r1', patientName: 'Alice M.', rating: 5, comment: 'Excellent doctor!', date: '2026-02-15' }
];

export const medicalRecords: MedicalRecord[] = [
    { id: 'mr1', name: 'Blood Test Report', type: 'PDF', date: '2026-02-20', doctor: 'Dr. Sarah Johnson', size: '2.4 MB' }
];

export const specializations = [
    'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic'
];
