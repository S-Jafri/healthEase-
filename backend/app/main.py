from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from typing import List, Optional
from pydantic import BaseModel

from app.database import init_db, get_session
from app.models import Patient, Doctor, Appointment, SuperAdmin, HospitalAdmin, Hospital, Department, Notification
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from chatbot.chatbot import MedicalChatbot
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="HealthEase Backend API", version="1.0.0", lifespan=lifespan)
chatbot_service = MedicalChatbot()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/patients", response_model=List[Patient], tags=["Patients"])
def read_patients(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    patients = session.exec(select(Patient).offset(skip).limit(limit)).all()
    return patients

@app.post("/patients", response_model=Patient, tags=["Patients"])
def create_patient(patient: Patient, session: Session = Depends(get_session)):
    db_patient = session.exec(select(Patient).where(Patient.email == patient.email)).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient

@app.get("/doctors", response_model=List[Doctor], tags=["Doctors"])
def read_doctors(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    doctors = session.exec(select(Doctor).offset(skip).limit(limit)).all()
    return doctors

@app.post("/doctors", response_model=Doctor, tags=["Doctors"])
def create_doctor(doctor: Doctor, session: Session = Depends(get_session)):
    db_doctor = session.exec(select(Doctor).where(Doctor.email == doctor.email)).first()
    if db_doctor:
        raise HTTPException(status_code=400, detail="Email already registered")
    session.add(doctor)
    session.commit()
    session.refresh(doctor)
    return doctor

@app.get("/hospitals", response_model=List[Hospital], tags=["Hospitals"])
def read_hospitals(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    hospitals = session.exec(select(Hospital).offset(skip).limit(limit)).all()
    return hospitals

@app.get("/departments", response_model=List[Department], tags=["Departments"])
def read_departments(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    departments = session.exec(select(Department).offset(skip).limit(limit)).all()
    return departments

@app.get("/appointments", response_model=List[Appointment], tags=["Appointments"])
def read_appointments(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    appointments = session.exec(select(Appointment).offset(skip).limit(limit)).all()
    return appointments

@app.post("/appointments", response_model=Appointment, tags=["Appointments"])
def create_appointment(appointment: Appointment, session: Session = Depends(get_session)):
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment

@app.post("/hospital-admins", response_model=HospitalAdmin, tags=["Admins"])
def create_hospital_admin(hadmin: HospitalAdmin, session: Session = Depends(get_session)):
    db_hadmin = session.exec(select(HospitalAdmin).where(HospitalAdmin.email == hadmin.email)).first()
    if db_hadmin:
        raise HTTPException(status_code=400, detail="Email already registered")
    session.add(hadmin)
    session.commit()
    session.refresh(hadmin)
    return hadmin

@app.post("/super-admins", response_model=SuperAdmin, tags=["Admins"])
def create_super_admin(sadmin: SuperAdmin, session: Session = Depends(get_session)):
    db_sadmin = session.exec(select(SuperAdmin).where(SuperAdmin.email == sadmin.email)).first()
    if db_sadmin:
        raise HTTPException(status_code=400, detail="Email already registered")
    session.add(sadmin)
    session.commit()
    session.refresh(sadmin)
    return sadmin

@app.get("/notifications", response_model=List[Notification], tags=["Notifications"])
def read_notifications(user_id: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Notification)
    if user_id:
        query = query.where(Notification.userId == user_id)
    notifications = session.exec(query).all()
    return notifications

class MarkReadRequest(BaseModel):
    userId: str

@app.patch("/notifications/read-all", tags=["Notifications"])
def mark_all_read(req: MarkReadRequest, session: Session = Depends(get_session)):
    notifications = session.exec(select(Notification).where(Notification.userId == req.userId, Notification.read == False)).all()
    for n in notifications:
        n.read = True
        session.add(n)
    session.commit()
    return {"status": "success", "marked_count": len(notifications)}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/login", tags=["Auth"])
def login_user(req: LoginRequest, session: Session = Depends(get_session)):
    su = session.exec(select(SuperAdmin).where(SuperAdmin.email == req.email, SuperAdmin.password == req.password)).first()
    if su: return su
    
    pat = session.exec(select(Patient).where(Patient.email == req.email, Patient.password == req.password)).first()
    if pat: return pat
    
    doc = session.exec(select(Doctor).where(Doctor.email == req.email, Doctor.password == req.password)).first()
    if doc: return doc
    
    ha = session.exec(select(HospitalAdmin).where(HospitalAdmin.email == req.email, HospitalAdmin.password == req.password)).first()
    if ha: return ha
    
    raise HTTPException(status_code=404, detail="User not found or invalid credentials")

class ChatbotRequest(BaseModel):
    query: str

@app.post("/chatbot/query", tags=["Chatbot"])
def chatbot_query(req: ChatbotRequest):
    response_msg = chatbot_service.get_response(req.query)
    return {
        "status": chatbot_service.mode,
        "message": response_msg
    }

@app.get("/")
def root():
    return {"message": "Welcome to the HealthEase API!"}

# --- WebSocket & Real-Time Queue Endpoints ---

from fastapi import WebSocket, WebSocketDisconnect
from app.sockets import manager

@app.websocket("/ws/queue/{doctor_id}")
async def websocket_queue_endpoint(websocket: WebSocket, doctor_id: str):
    await manager.connect(websocket, doctor_id)
    try:
        while True:
            # We don't strictly expect the client to send messages, just listen.
            # But we must keep the loop alive to receive disconnects
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, doctor_id)

class AppointmentStatusUpdate(BaseModel):
    status: str
    delayMinutes: Optional[int] = 0

@app.patch("/appointments/{id}/status", response_model=Appointment, tags=["Appointments"])
async def update_appointment_status(id: str, req: AppointmentStatusUpdate, session: Session = Depends(get_session)):
    apt = session.exec(select(Appointment).where(Appointment.id == id)).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    apt.status = req.status
    session.add(apt)
    session.commit()
    session.refresh(apt)
    
    # Broadcast the queue movement to all listeners watching this doctor's queue
    if req.status in ["completed", "skipped", "delayed"]:
        # Find who is the next waiting patient to broadcast the new "Running Token"
        queue = session.exec(select(Appointment).where(
            Appointment.doctorId == apt.doctorId,
            Appointment.status == "waiting",
            # Ensure it's for today implicitly in a real app, here we assume ordered tokens
        ).order_by(Appointment.tokenNumber)).all()

        next_token = queue[0].tokenNumber if len(queue) > 0 else 0
        
        await manager.broadcast({
            "type": "QUEUE_UPDATE",
            "currentToken": next_token,
            "delayMinutes": req.delayMinutes,
            "updatedToken": apt.tokenNumber,
            "action": req.status
        }, doctor_id=apt.doctorId)

    return apt
