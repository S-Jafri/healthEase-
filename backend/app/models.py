from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

# Base Users
# Removed UserBase due to SQLModel multiple inheritance crash

class SuperAdmin(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(default="pass123")
    name: str
    role: str
    contactNumber: Optional[str] = None

class Hospital(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    address: str
    registrationNumber: str
    contactEmail: str
    isActive: bool = Field(default=False)

class Department(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    hospitalId: str = Field(foreign_key="hospital.id")
    name: str

class HospitalAdmin(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(default="pass123")
    name: str
    role: str
    contactNumber: Optional[str] = None
    hospitalId: str = Field(foreign_key="hospital.id")

class Patient(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(default="pass123")
    name: str
    role: str
    contactNumber: Optional[str] = None
    age: int
    dob: Optional[str] = None
    bloodGroup: str
    medicalHistorySummary: str

class Doctor(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(default="pass123")
    name: str
    role: str
    contactNumber: Optional[str] = None
    hospitalId: str = Field(foreign_key="hospital.id")
    departmentId: str = Field(foreign_key="department.id")
    qualifications: str
    specialization: str
    experienceYears: int
    licenseNumber: str
    consultationFee: float
    isActive: bool = Field(default=True)

class Appointment(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    patientId: str = Field(foreign_key="patient.id", index=True)
    doctorId: str = Field(foreign_key="doctor.id", index=True)
    hospitalId: str = Field(foreign_key="hospital.id", index=True)
    date: str  
    tokenNumber: int
    status: str = Field(default="waiting")
    estimatedTime: Optional[str] = None

class Notification(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    userId: str = Field(index=True)
    title: str
    message: str
    type: str # 'info' | 'success' | 'warning' | 'error'
    read: bool = Field(default=False)
    createdAt: str
